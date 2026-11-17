AGROCONTROL NICARAGUA — VERSIÓN PILOTO CON ANÁLISIS VISUAL DE IA
Idioma: español (Nicaragua)

QUÉ INCLUYE
- Aplicación web progresiva adaptable a teléfonos y computadoras.
- Captura y compresión de fotografías.
- Registro local de productores, fincas, cultivos, evaluaciones y fotografías.
- Exportación e importación de respaldos JSON y exportación CSV.
- Módulo de café robusta con orientación por síntomas y calculadora de rendimiento por muestreo.
- NUEVO: módulo de manejo nutricional con calendarios de referencia INTA para café, yuca, frijol de Costa Caribe y banano, más planes pendientes de validación para cacao, maíz y plátano.
- Calculadora de fertilizante edáfico por manzana y calculadora de conversión de dosis foliar desde la etiqueta del producto.
- NUEVO: botón “Analizar fotografía con IA” para enviar la imagen y el contexto del cultivo a un modelo de visión mediante una función segura de Netlify.
- El resultado de IA se puede guardar junto con la evaluación local.

IMPORTANTE SOBRE EL DIAGNÓSTICO
- La IA ofrece una orientación visual preliminar, no un diagnóstico fitopatológico definitivo.
- Una sola foto no siempre permite distinguir enfermedades con síntomas parecidos, plagas, deficiencias, fitotoxicidad o estrés ambiental.
- La respuesta incluye observaciones, posibles causas, diagnósticos diferenciales, nivel de confianza orientativo, qué revisar y manejo integrado preliminar.
- No prescribe marcas, dosis ni mezclas de plaguicidas. La IA propone manejo integrado preliminar y distingue deficiencias nutricionales de enfermedades cuando la imagen/contexto lo permiten. La recomendación debe validarse con un técnico y, cuando proceda, laboratorio.
- No se ha entrenado un modelo especializado con fotografías locales de Nicaragua; se utiliza un modelo general de visión. Para una herramienta institucional se necesita un conjunto local de imágenes etiquetadas y validación independiente.

REQUISITOS PARA ACTIVAR LA IA
1. Tener una cuenta de OpenAI API y una clave API con facturación/créditos habilitados. La suscripción de ChatGPT no incluye automáticamente el consumo de API; el uso de API se factura por separado.
2. Publicar este proyecto en Netlify con soporte de Netlify Functions. Para esta versión, no basta con arrastrar solo los archivos estáticos si la función no se despliega; utiliza un despliegue que construya las funciones (por ejemplo, repositorio Git conectado a Netlify o Netlify CLI).
3. En Netlify, abre Site configuration / Environment variables (o Project configuration / Environment variables, según la interfaz) y agrega:
   - OPENAI_API_KEY = tu clave secreta de OpenAI API.
   - AGROCONTROL_AI_CODE = un código privado que tú elijas y compartirás solo con los técnicos autorizados.
   - OPENAI_VISION_MODEL = gpt-6-astra (opcional; si no se define, se usa este valor por defecto).
4. Guarda las variables y vuelve a desplegar el sitio para que la función las reciba.
5. En la aplicación, entra a “Analizar foto”, completa productor y cultivo, selecciona una imagen, escribe el código privado y pulsa “Analizar fotografía con IA”.
6. Comprueba el resultado con un técnico y guarda la evaluación si corresponde.

SEGURIDAD Y COSTOS
- Nunca escribas OPENAI_API_KEY dentro de index.html, app.js ni ningún archivo visible al navegador. Debe permanecer únicamente como variable de entorno de Netlify.
- El código privado AGROCONTROL_AI_CODE es una barrera básica compartida, no sustituye usuarios individuales, límites por usuario ni autenticación institucional. No publiques el acceso ampliamente hasta añadir control de acceso y límites de uso adecuados.
- Configura límites de gasto y alertas en la plataforma de OpenAI API. Cada análisis de imagen puede generar consumo de API.
- Evita subir fotos con rostros, documentos personales o datos sensibles innecesarios.

DATOS Y ALMACENAMIENTO
- Los registros y fotografías continúan guardándose en el navegador/dispositivo; todavía no hay base de datos central ni sincronización entre técnicos.
- Exporta respaldos JSON periódicamente. Los registros locales pueden perderse si se borran los datos del navegador o se cambia de dispositivo.
- La imagen enviada al servicio de IA sale del dispositivo para ser analizada por el proveedor de API. No uses fotos sensibles sin autorización y una política de privacidad adecuada.

PUBLICACIÓN / ACTUALIZACIÓN
- Esta carpeta contiene index.html en la raíz y netlify/functions/diagnose.mjs.
- Configura Netlify para publicar la raíz del proyecto y construir las funciones indicadas en netlify.toml.
- No despliegues únicamente el contenido estático omitiendo netlify/functions, porque el botón de IA no funcionará.
- Después de actualizar, recarga la aplicación. Si el teléfono conserva una versión antigua, cierra la PWA y vuelve a abrirla para que se actualice el caché.

PRUEBA ANTES DE USO REAL
- Prueba con fotos claras de hojas, tallos y frutos, en luz natural.
- Compara el resultado con la evaluación de un técnico competente.
- Registra falsos positivos y casos no identificables; no uses el resultado como única base para aplicar agroquímicos.


MÓDULO DE MANEJO NUTRICIONAL
- Las tablas son referencias de guías técnicas nacionales y no recetas universales.
- Café: guía general de café INTA 2018; no es una tabla exclusiva para robusta.
- Yuca: INTA 2018, dos momentos de fertilización y diferenciación Costa Caribe/resto del país.
- Frijol: recomendación de establecimiento para Costa Caribe; la inoculación con Rhizobium puede cambiar la necesidad de urea de cobertura.
- Banano: guía INTA 2018; no trasladar automáticamente las dosis al plátano.
- Cacao, maíz y plátano: el módulo advierte que no se deben inventar dosis; requiere guía específica, análisis y validación local.
- La calculadora foliar solo convierte la dosis escrita en la etiqueta a volumen de bomba; no prescribe la dosis.
Fuentes enlazadas dentro del módulo: INTA Recomendaciones Café 2018, Yuca 2018, Banano 2018, Cacao 2018 y Manual de Granos Básicos.
