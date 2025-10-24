# 🔧 Configuración de Vercel Blob

## Paso 1: Obtener Token de Vercel Blob

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **rcweb**
3. Ve a la pestaña **Storage**
4. Haz clic en **Create Database**
5. Selecciona **Blob**
6. Haz clic en **Create**
7. Una vez creado, ve a la pestaña **Settings** del Blob Store
8. Copia el token que aparece como `BLOB_READ_WRITE_TOKEN`

## Paso 2: Agregar Token a .env.local

Agrega esta línea a tu archivo `.env.local`:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXXXX
```

## Paso 3: Agregar a Vercel Environment Variables (Producción)

1. Ve a **Settings** → **Environment Variables**
2. Agrega:
   - **Key:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** El token que copiaste
   - **Environments:** Production, Preview, Development (selecciona todos)
3. Haz clic en **Save**

## Paso 4: Redeploy (Opcional)

Si ya tienes tu sitio en producción, haz un redeploy para que las nuevas variables tomen efecto.

---

## 📝 Notas

- El token es **gratuito** hasta 1GB de almacenamiento
- Los PDFs de invoices pesan ~50KB cada uno
- Con 1GB puedes almacenar ~20,000 invoices
- Pricing adicional: $0.15/GB almacenamiento, $0.20/GB transferencia

## ✅ Verificación

Para verificar que está configurado correctamente, ejecuta:

```bash
npm run dev
```

Y revisa que no haya errores relacionados con `BLOB_READ_WRITE_TOKEN` en la consola.
