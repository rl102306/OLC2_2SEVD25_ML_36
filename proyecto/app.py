from flask import Flask, request, jsonify
import pandas as pd
from modelo.random_forest import entrenar_modelo, metricas
from utils.prediccion import predecir_riesgo
app = Flask(__name__)

data_limpio = None
metricas_generadas = None

columnas_val = [
    'promedio_actual', 'asistencia_clases', 'tareas_entregadas',
    'participacion_clase', 'horas_estudio', 'promedio_evaluaciones',
    'cursos_reprobados', 'actividades_extracurriculares', 'reportes_disciplinarios', 'riesgo'
]

def limpiar_datos(df):
    duplicados_eliminados = df.duplicated().sum()
    df = df.drop_duplicates().reset_index(drop=True) # eliminar datos duplicados

    columnas_numericas = [
        'promedio_actual', 'asistencia_clases', 'tareas_entregadas',
        'participacion_clase', 'horas_estudio', 'promedio_evaluaciones',
        'cursos_reprobados', 'reportes_disciplinarios'
    ]
    for col in columnas_numericas:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce') # convertir a numérico todas las columnas numéricas


    nulos = {}
    for col in df.columns:
        nulos_antes = df[col].isnull().sum()
        if nulos_antes > 0:
            if col == 'horas_estudio':
                valor = df[col].median()
                df[col] = df[col].fillna(valor)
            elif col == 'reportes_disciplinarios':
                valor = df[col].median()
                df[col] = df[col].fillna(valor)
            elif col == 'cursos_reprobados':
                valor = df[col].median()
                df[col] = df[col].fillna(valor)
            elif col in ['promedio_actual', 'promedio_evaluaciones']:
                valor = df[col].mean()
                df[col] = df[col].fillna(valor)
            elif col in ['asistencia_clases', 'tareas_entregadas']:
                valor = df[col].median()
                df[col] = df[col].fillna(valor)
            elif col == 'actividades_extracurriculares': # ya que este es categórica
                valor = None
            else:
                if df[col].dtype == 'object':
                    valor = df[col].mode()[0] if not df[col].mode().empty else 'desconocido'
                    df[col] = df[col].fillna(valor)
                else:
                    valor = 0
                    df[col] = df[col].fillna(valor)
            
            nulos_despues = df[col].isnull().sum()
            nulos[col] = int(nulos_antes - nulos_despues) 
            
    # quitar valores negativos y rangos
    for col in ['asistencia_clases', 'tareas_entregadas', 'participacion_clase', 'horas_estudio',
                'promedio_evaluaciones', 'cursos_reprobados', 'reportes_disciplinarios']:
        if col in df.columns:
            df[col] = df[col].clip(lower=0)

    for col in ['asistencia_clases', 'tareas_entregadas']:
        if col in df.columns:
            df[col] = df[col].clip(upper=100)

    
    resumen_limpieza = { # regresar que se limpio
        'duplicados_eliminados': int(duplicados_eliminados),
        'nulos_manejados': {col: int(val) for col, val in nulos.items()}
    }

    return df, resumen_limpieza

@app.route("/carga-masiva", methods=["POST"])
def carga_masiva():
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400
    file = request.files["file"]
    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Solo se permiten archivos CSV"}), 400
    
    try:
        df = pd.read_csv(file)
        
        # Validar columnas
        columnas_presentes = set(df.columns)
        columnas_faltantes = [col for col in columnas_val if col not in columnas_presentes]
        if columnas_faltantes:
            return jsonify({
                "error": "Faltan columnas requeridas",
                "columnas_faltantes": columnas_faltantes
            }), 400
        
        global data_limpio
        data_limpio, resumen_limpieza = limpiar_datos(df)
        
        return jsonify({ # exito
            "mensaje": "Carga masiva y limpieza exitosa",
            "filas": int(data_limpio.shape[0]),
            "columnas": int(data_limpio.shape[1]),
            "columnas_nombres": list(data_limpio.columns),
            "resumen_limpieza": resumen_limpieza
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/entrenar", methods=["POST"])
def entrenar():
    global data_limpio
    global metricas_generadas
    
    if data_limpio is None:
        return jsonify({"error": "cargar archivo csv"}), 400
    
    try:
        metricas_resultado = entrenar_modelo(data_limpio)
        metricas_generadas = metricas_resultado
        return jsonify({
            "mensaje": "Modelo entrenado exitosamente",
            "modelo": "Random Forest",
            "metricas": metricas_resultado
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/metricas", methods=["GET"])
def obtener_metricas():
    global metricas_generadas
    if not metricas_generadas:
        return jsonify({"error": "Métricas no disponibles"}), 400
    return jsonify({
        "exactitud": round(metricas_generadas["exactitud"], 2),
        "precision": round(metricas_generadas["precision"], 2),
        "recall": round(metricas_generadas["recall"], 2),
        "f1_score": round(metricas_generadas["f1_score"], 2)
    }), 200

@app.route("/predecir", methods=["POST"])
def predecir():
    try:
        datos = request.get_json()
        
        claves_requeridas = [
            "promedio_actual", "asistencia_clases", "tareas_entregadas",
            "participacion_clase", "horas_estudio", "promedio_evaluaciones",
            "cursos_reprobados", "actividades_extracurriculares", "reportes_disciplinarios"
        ]
        
        for clave in claves_requeridas:
            if clave not in datos:
                return jsonify({"error": f"Falta el campo requerido: {clave}"}), 400
    
        resultado = predecir_riesgo(datos)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)