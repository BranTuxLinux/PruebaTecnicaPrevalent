# Documentación de la Implementación

## Configuración Inicial

Para este proyecto, inicié la implementación desde cero utilizando la estructura del **Page Router** para la API y la configuración del backend. Sin embargo, debido a conflictos actuales entre la librería Auth.js y Next/Auth, no fue posible migrar completamente al Page Router. Aun así, se pudo configurar correctamente Apollo Server para GraphQL. En el lado del cliente surgieron varios inconvenientes con la versión actual de Next.js y el App Router; gracias al apoyo del siguiente [blog](https://www.apollographql.com/blog/using-apollo-client-with-next-js-13-releasing-an-official-library-to-support-the-app-router), se logró implementar el cliente de Apollo.

La configuración de Prisma, Auth0 y Supabase fue sencilla y no presentó mayores inconvenientes.

> **Cita de la Prueba Técnica:**
>
> "Cumplimiento de todos los requisitos funcionales.  
> Correcta implementación del CRUD para ingresos, egresos y usuarios.  
> Generación y descarga de reportes en formato CSV."

En este proyecto, opté por implementar un CRUD básico para usuarios, a pesar de que no se requería una funcionalidad extensa para ellos. Además, traté ingresos y egresos como una única entidad denominada **movimientos**.

## Gestión de Permisos

El control de acceso se implementa en el backend a través de la función `checkRole`, asegurando que cada petición cumpla con las restricciones correspondientes. Tanto en el frontend como en el backend, se utilizan middlewares para proteger las páginas y gestionar los permisos de acceso de forma efectiva.



## Estructura del Proyecto

La organización y el orden del proyecto se basan en la "Prefix Naming Convention", siguiendo las pautas establecidas en el siguiente [documento](https://www.ict.up.ac.th/surinthips/PackageProgramApllication/Week6/NamingConventions.pdf).

## Pruebas Unitarias

Se implementaron pruebas unitarias utilizando **Vitest**. La elección de Vitest se debió a que Jest presentaba problemas de compatibilidad con Next.js 15.  
- Para ejecutar las pruebas se utilizan los siguientes comandos:
  - `bun run test` – para correr las pruebas.


  - `bun run test:ui` – para la versión con visualización en el navegador.

### Modelos Gráficos de las Pruebas

![Gráfico de las Paginas](assets/test3.png)
![Gráfico de las Utilidades](assets/test4.png)

---
## Uso de Bun

Se optó por **Bun** para la instalación de dependencias y la ejecución de comandos, ya que herramientas como npm, pnpm y yarn han tenido inconvenientes para instalar correctamente los paquetes de GraphQL y Auth.js debido a problemas de versionamiento.

## Despliegue en Vercel

Es importante señalar que, debido a incompatibilidades actuales, el entorno de Vercel no funciona correctamente con GraphQL en esta configuración. Lamentablemente, el poco tiempo que pude dedicarle al proyecto (debido a mis compromisos como freelance) y la escasa documentación actual sobre la integración de GraphQL con Vercel impidieron solucionar este inconveniente. 

La aplicación se construye correctamente utilizando el comando `bun run build`. Cabe destacar que, para la conexión SSL a Supabase desde Vercel, la configuración es distinta; por ello, la versión que funciona en Vercel se encuentra en un tag específico de GitHub. Para acceder a este tag, consulta la referencia en el repositorio y luego prueba la implementación utilizando el comando `vercel ---prod`.

### Desde Vercel
> https://prueba-tecnica-prevalent-two.vercel.app/

![Vista de vercel](assets/view.png)

## Comandos para Ejecución en Local

A continuación, se detalla la secuencia de comandos para instalar y ejecutar el proyecto de forma local:

```bash
# Instalación de dependencias
bun install

# Generación de Prisma (se ejecuta automáticamente a través de postinstall)
bunx prisma generate

# Modo de desarrollo
bun dev

# Construcción del proyecto
bun run build

# Ejecución de la versión construida en producción (localmente)
bun run start
```

## Vista de Reportes

Para la visualización de los reportes, he optado por utilizar un gráfico de líneas. Personalmente, considero que este tipo de gráfico es ideal para analizar datos financieros como ingresos, gastos y balances a lo largo del tiempo. Permíteme contarte por qué elegí este enfoque y cómo aprovecha al máximo las características de nuestros datos:

1. **Visualización de tendencias temporales:**  
   El gráfico de líneas es excepcional para mostrar la evolución de los datos con el paso del tiempo. En este caso:
   - **Eje X:** Representa las fechas, permitiendo ver cómo varían los ingresos, gastos y balances día a día.
   - **Eje Y:** Muestra los valores numéricos correspondientes a cada uno de estos indicadores.

   Esto facilita la identificación de:
   - **Tendencias:** ¿Los ingresos están aumentando o disminuyendo con el tiempo?
   - **Patrones:** ¿Existen días en los que los gastos o ingresos presentan valores atípicos?
   - **Relaciones:** Se puede apreciar de manera clara cómo se relacionan los ingresos y los gastos con el balance general.


## # Vista de Reporte

### 1. El uso de reporte

En la parte de finanzas

![Step 1 screenshot](https://images.tango.us/workflows/cbda6a2f-9d61-4ff8-8e26-312ccfb5f024/steps/854138a5-c84b-4275-9ce2-8c22dd357c3f/a91f0b59-d603-4970-aa0e-e89c1e3c7030.png?crop=focalpoint&fit=crop&fp-x=0.6204&fp-y=0.3178&fp-z=1.3382&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=10&mark-y=275&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xMTgxJmg9NDI3JmZpdD1jcm9wJmNvcm5lci1yYWRpdXM9MTA%3D)


### 2. Se selecciona la fecha de inicio
![Step 2 screenshot](https://images.tango.us/workflows/cbda6a2f-9d61-4ff8-8e26-312ccfb5f024/steps/00fd7c1d-ce38-43d6-a48b-8f15f60cb5c1/455f6d34-fd2d-4ffd-9e30-6d6b258dc9d9.png?crop=focalpoint&fit=crop&fp-x=0.8110&fp-y=0.2768&fp-z=2.8562&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=143&mark-y=492&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz05MTUmaD0xNjQmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)


### 3. Para el mejor rendimiento se selecciona el 1 de enero

esto es porque se tienen en cuenta todos los datos de la base de datos estan desde esa fecha

![Step 3 screenshot](https://images.tango.us/workflows/cbda6a2f-9d61-4ff8-8e26-312ccfb5f024/steps/f66dbf32-e957-4459-a15f-43295eae4cb0/e366fe84-4175-4faa-83ad-03a89d9041f5.png?crop=focalpoint&fit=crop&fp-x=0.8105&fp-y=0.4134&fp-z=2.8939&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=524&mark-y=498&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xNTEmaD0xNTEmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)


### 4. Se selecciona Cambiar fecha
![Step 4 screenshot](https://images.tango.us/workflows/cbda6a2f-9d61-4ff8-8e26-312ccfb5f024/steps/d0cb0ad2-654c-47f5-be23-cfbe352b276d/b9ce6d3a-d991-4260-8ba6-bdaba0e592be.png?crop=focalpoint&fit=crop&fp-x=0.7467&fp-y=0.3861&fp-z=2.8562&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=363&mark-y=492&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz00NzQmaD0xNjQmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)


### 5. El grafico cambiara y mostrara todos los detalles,

El grafico cambia si agrega o elimina datos en la vista de finanza, el csv es depende del grafico que muestre

![Step 5 screenshot](https://images.tango.us/workflows/cbda6a2f-9d61-4ff8-8e26-312ccfb5f024/steps/615e793b-f6e0-4493-83db-a0212578a256/20a61f52-99c4-466c-9686-6d63432026ba.png?crop=focalpoint&fit=crop&fp-x=0.6204&fp-y=0.6708&fp-z=1.3382&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=10&mark-y=299&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xMTgxJmg9Njg2JmZpdD1jcm9wJmNvcm5lci1yYWRpdXM9MTA%3D)

![Vista de vercel](assets/csv.png)

*PD: sorry por el ingles*