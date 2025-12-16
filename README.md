# OLC2 Vacaciones 2S

## Victor Abdiel Lux Juracán - 201403946 
## Victor Ronaldo Gomez Lara - 201114493

## Endpoints para Front

### Carga masiva 

#### `Post: /carga-masiva`

Se espera un archivo

| Key  |Value |
|------|------|
| file | File |

file: archivo.csv

Respuesta : se espera el siguiente json si es exitosa la cargar
```json
{
    "columnas": 14,
    "columnas_nombres": [
        "asistencia_clases",
        "tareas_entregadas",
        ...
    ],
    "filas": 200,
    "mensaje": "Carga masiva y limpieza exitosa",
    "resumen_limpieza": {
        "duplicados_eliminados": 0,
        "nulos_manejados": {
            "carnet": 25,
            "promedio_actual": 26
        }
    }
}
```
los errores pueden dar 

```json
{"error": "Solo se permiten archivos CSV"}, 400

{"error": "No se envió ningún archivo"}, 400

{
"error": "Faltan columnas requeridas",
"columnas_faltantes": 
        ...
}, 400
```
---

### Entrenamiento del modelo

#### `POST /entrenar`
Entrenar el modelo con los datos cargados

```json
{
  "modelo": "random_forest"
}
```

Respuesta 

```json
{
  "mensaje": "Modelo entrenado exitosamente"
}
```
errores
```json
{"error": "cargar archivo csv"}, 400


```


---

### Métricas de rendimiento

####  `GET /metricas`

Este es para mostrar las metricas que se van a mostrar en evaluacion de rendimiento

Se espera 

```bash
{
  "exactitud": 0.87,
  "precision": 0.85,
  "recall": 0.90,
  "f1_score": 0.87
}
```
errores
```json
{"error": "Métricas no disponibles"}, 400
```
---

### Ajuste de hiperparámetros

#### `POST /ajustar-hiperparametros`

```json
{

}
```

**Response**

```json
{
  "mensaje": "Modelo reentrenado",
  "accuracy": 0.89
}
```


---

### Predicción individual

#### `POST /predecir`

Este es para mostrar la evaluacion por estudiante específico

espera que se le mande

```bash
{
  "promedio_actual": 72,
  "asistencia_clases": 65,
  "tareas_entregadas": 70,
  "participacion_clase": 50,
  "horas_estudio": 6,
  "promedio_evaluaciones": 68,
  "cursos_reprobados": 2,
  "actividades_extracurriculares": 0,
  "reportes_disciplinarios": 1
}
```

y que devuelva

```bash
{
  "riesgo": "riesgo",
  "probabilidad": 0.82
}
```

---



