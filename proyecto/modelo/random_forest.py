import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score


modelo_entrenado = None
metricas = {}

def entrenar_modelo(df: pd.DataFrame):
    global modelo_entrenado, metricas
    
    # riesgo pasa a 1 y no riesgo a 0
    le = LabelEncoder()
    df['riesgo_encoded'] = le.fit_transform(df['riesgo'])
    

    features = [
        'promedio_actual', 'asistencia_clases', 'tareas_entregadas',
        'participacion_clase', 'horas_estudio', 'promedio_evaluaciones',
        'cursos_reprobados', 'actividades_extracurriculares', 'reportes_disciplinarios'
    ]
    
    X = df[features]
    y = df['riesgo_encoded']
    if 'actividades_extracurriculares' in X.columns:
        def contar_actividades(valor):
            if pd.isna(valor) or valor == '[]' or valor is None:
                return 0
            try:
                return len(eval(valor)) if isinstance(valor, str) else 0
            except:
                return 0
        X['actividades_extracurriculares'] = X['actividades_extracurriculares'].apply(contar_actividades)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    modelo = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    modelo.fit(X_train, y_train)

    y_pred = modelo.predict(X_test)
    
    metricas = {
        "exactitud": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred), 4),
        "recall": round(recall_score(y_test, y_pred), 4),
        "f1_score": round(f1_score(y_test, y_pred), 4)
    }
    
    modelo_entrenado = modelo
    with open("modelo_random_forest.pkl", "wb") as f:
        pickle.dump({
            'modelo': modelo,
            'label_encoder': le,
            'features': features
        }, f)
    
    print("Modelo Random Forest entrenado y guardado exitosamente.")
    return metricas