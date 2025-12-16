
import pickle
import pandas as pd

ruta_simbolo = "modelo_random_forest.pkl"

def predecir_riesgo(datos_estudiante: dict):
    try:
        with open(ruta_simbolo, "rb") as f:
            saved_data = pickle.load(f)
        
        modelo = saved_data['modelo']
        label_encoder = saved_data['label_encoder']
        features = saved_data['features']
        

        df_input = pd.DataFrame([datos_estudiante])
        

        if 'actividades_extracurriculares' in df_input.columns:
            df_input['actividades_extracurriculares'] = df_input['actividades_extracurriculares'].astype(int)
        

        df_input = df_input[features]
        

        probabilidad_riesgo = modelo.predict_proba(df_input)[0][1]
        

        prediccion = modelo.predict(df_input)[0]
        riesgo_texto = label_encoder.inverse_transform([prediccion])[0]
        

        if riesgo_texto == "riesgo" or riesgo_texto == 1:
            riesgo_final = "riesgo"
        else:
            riesgo_final = "no riesgo"
        
        return {
            "riesgo": riesgo_final,
            "probabilidad": round(probabilidad_riesgo, 2)
        }
        
    except FileNotFoundError:
        raise Exception("No se encontró el modelo entrenado. Primero ejecuta POST /entrenar")
    except Exception as e:
        raise Exception(f"Error en predicción: {str(e)}")