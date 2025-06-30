import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { showMessage } from 'react-native-flash-message';

export type Asistencia = {
  cedula: string;
  nombre: string;
  carrera: string;
  horario: string;
};

export async function exportAsistenciasToPdf(data: Asistencia[]): Promise<void> {
  if (!data || data.length === 0) {
    showMessage({
      message: 'Error',
      description: 'No hay datos para exportar.',
      type: 'danger',
    });
    return;
  }

  // Obtener fecha actual formateada
  const now = new Date();
  const fechaGeneracion = now.toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const horaGeneracion = now.toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Construir HTML para el PDF con diseño mejorado
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page {
            margin: 40px 30px 60px 30px;
            @top-center {
              content: "Servicio Nutricional";
            }
            @bottom-center {
              content: "Página " counter(page) " / Servicio Nutricional";
            }
          }
          
          body { 
            font-family: 'Helvetica', Arial, sans-serif; 
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.4;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #0066CC;
          }
          
          .header h1 {
            font-size: 20px;
            font-weight: bold;
            color: #0066CC;
            margin: 15px 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .header h2 {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            margin: 8px 0;
          }
          
          .header h3 {
            font-size: 14px;
            color: #555;
            margin: 5px 0 20px 0;
          }
          
          .report-info {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 5px solid #0066CC;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .report-title {
            font-size: 24px;
            font-weight: bold;
            color: #0066CC;
            text-align: center;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .report-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 14px;
          }
          
          .report-details div {
            background: white;
            padding: 8px 15px;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .report-details strong {
            color: #0066CC;
          }
          
          .stats-section {
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 2px solid #e3f2fd;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 10px;
          }
          
          .stat-card {
            background: linear-gradient(135deg, #0066CC 0%, #0052a3 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,102,204,0.3);
          }
          
          .stat-number {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .stat-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
          }
          
          .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 30px;
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse;
            font-size: 13px;
          }
          
          thead {
            background: linear-gradient(135deg, #0066CC 0%, #0052a3 100%);
          }
          
          th { 
            color: white;
            padding: 18px 12px;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 12px;
            position: relative;
          }
          
          th:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 25%;
            height: 50%;
            width: 1px;
            background: rgba(255,255,255,0.3);
          }
          
          td { 
            padding: 14px 12px;
            text-align: center;
            border-bottom: 1px solid #e8f4fd;
            transition: background-color 0.2s ease;
          }
          
          tbody tr:nth-child(odd) { 
            background: #fafbfc;
          }
          
          tbody tr:nth-child(even) { 
            background: #f8f9fa;
          }
          
          tbody tr:hover {
            background: #e3f2fd !important;
          }
          
          .cedula-col {
            font-weight: bold;
            color: #0066CC;
          }
          
          .nombre-col {
            font-weight: 600;
            color: #2c3e50;
          }
          
          .carrera-col {
            font-style: italic;
            color: #555;
          }
          
          .horario-col {
            background: #e8f5e8 !important;
            color: #2e7d32;
            font-weight: 600;
            border-radius: 4px;
          }
          
          .footer-info {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 2px solid #e9ecef;
            padding-top: 20px;
          }
          
          .footer-info .generated-by {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
          }
          
          /* Estilos para impresión */
          @media print {
            .table-container {
              page-break-inside: avoid;
            }
            
            tbody tr {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <!-- Header similar al FPDF -->
        <div class="header">
          <h1>Servicio Nutricional</h1>
          <h2>Universidad Politécnica Territorial Andrés Eloy Blanco</h2>
          <h3>Barquisimeto - Edo - Lara</h3>
        </div>

        <!-- Información del reporte -->
        <div class="report-info">
          <div class="report-title">Listado de Asistencias</div>
          <div class="report-details">
            <div><strong>Fecha:</strong> ${fechaGeneracion}</div>
            <div><strong>Hora:</strong> ${horaGeneracion}</div>
            <div><strong>Total:</strong> ${data.length} registros</div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="stats-section">
          <h3 style="margin: 0 0 10px 0; color: #0066CC; text-align: center;">Resumen Estadístico</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${data.length}</div>
              <div class="stat-label">Total Asistencias</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${new Set(data.map(item => item.carrera)).size}</div>
              <div class="stat-label">Carreras Distintas</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${new Set(data.map(item => item.horario)).size}</div>
              <div class="stat-label">Horarios Diferentes</div>
            </div>
          </div>
        </div>

        <!-- Tabla de datos -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Cédula</th>
                <th style="width: 35%;">Nombre y Apellido</th>
                <th style="width: 35%;">Carrera</th>
                <th style="width: 15%;">Horario</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item, index) => `
                <tr>
                  <td class="cedula-col">${item.cedula}</td>
                  <td class="nombre-col">${item.nombre}</td>
                  <td class="carrera-col">${item.carrera}</td>
                  <td class="horario-col">${item.horario}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Footer info -->
        <div class="footer-info">
          <div style="color: #0066CC; font-weight: bold;">Servicio Nutricional - UPTAEB</div>
          <div class="generated-by">
            Documento generado automáticamente el ${fechaGeneracion} a las ${horaGeneracion}
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // Verificar si la función de compartir está disponible
    const sharingAvailable = await Sharing.isAvailableAsync();
    
    if (!sharingAvailable) {
      showMessage({
        message: 'Error',
        description: 'La función de compartir no está disponible en este dispositivo.',
        type: 'danger',
      });
      return;
    }

    // Generar el PDF con configuraciones mejoradas
    const { uri } = await Print.printToFileAsync({ 
      html, 
      base64: false,
      width: 612,  // Ancho estándar carta
      height: 792, // Alto estándar carta
    });

    if (!uri) {
      throw new Error('No se pudo generar el archivo PDF');
    }

    // Compartir el archivo con opciones específicas
    await Sharing.shareAsync(uri, { 
      mimeType: 'application/pdf',
      dialogTitle: 'Exportar Listado de Asistencias',
      UTI: 'com.adobe.pdf'
    });

    showMessage({
      message: 'Éxito',
      description: 'PDF generado correctamente',
      type: 'success',
    });

  } catch (error) {
    console.error('Error al generar PDF:', error);
    
    let errorMessage = 'No se pudo generar el PDF. Inténtalo nuevamente.';
    
    if (error instanceof Error) {
      if (error.message.includes('EACCES') || error.message.includes('permission')) {
        errorMessage = 'Error de permisos. Verifica que la aplicación tenga acceso al almacenamiento.';
      } else if (error.message.includes('ENOSPC') || error.message.includes('storage')) {
        errorMessage = 'Espacio insuficiente. Libera espacio en tu dispositivo e inténtalo de nuevo.';
      } else if (error.message.includes('ENOENT')) {
        errorMessage = 'No se pudo acceder al directorio de almacenamiento.';
      }
    }
    
    showMessage({
      message: 'Error',
      description: errorMessage,
      type: 'danger',
    });
  }
}