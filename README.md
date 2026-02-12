# React + TypeScript + Vite

## EJECUCIÓN

npm run install

npm run start

para hotreaload
npm run start:dev

## ENV VARS

MONGO_URI='mongodb+srv://andreuolleria_db_user:cZEkLScYKCqOslJZ@cluster0.ze0ymmv.mongodb.net/pavapark?appName=Cluster0'

JWT_SECRET='pavapark'

# MIGRACIONES/SEED

No necesario en el caso de mongodb con moongose ya que todos los esquemas se definen bajo resource/schema. Si testeais con la mongo_uri de env ya esta todo montado en el servidor online que proporciona mongo atlas. Igualmente si lo veis en local dejo las collections en formato .json bajo la carpeta collections aunque no he encontrado una forma rápida de importarlo y exportarlo.

## DECISIONES

active/paused boolean porque solo son dos estados

He utilizado mongodb porque no requiere instalación y estoy familiarizado con el por otros proyectos, se parece a firebase con el cual tambien tengo experiencia

mongoose utilizado ya anteriormente en otros proyectos

## MEJORAS

hacer interfaces de los dos tipos de formato haceptado en ingestions

interface para tempData

mejorar tipado en general

ingestions resource innecesario, solo ingestions.schema

homogenizar y debatir importancia sensorCode o id

hacer la MANUAL_UPLOAD

retornar errores claros en el mensaje de error de ingestions

retornar más errores personalizados

limpiar código no usado
