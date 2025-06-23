import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export type Asistencia = {
  cedula: string;
  nombre: string;
  carrera: string;
  horario: string;
};

export async function exportAsistenciasToPdf(data: Asistencia[]): Promise<void> {
  if (!data || data.length === 0) {
    throw new Error('No hay datos para exportar.');
  }

  // Construir HTML para la tabla
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h2 { color: #0066CC; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #3399FF; padding: 8px 6px; text-align: center; font-size: 14px; }
          th { background: #0066CC; color: #fff; }
          tr:nth-child(even) { background: #f6faff; }
        </style>
      </head>
      <body>
        <h2>Listado de Asistencias</h2>
        <table>
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre y Apellido</th>
              <th>Carrera</th>
              <th>Horario de Comida</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td>${item.cedula}</td>
                <td>${item.nombre}</td>
                <td>${item.carrera}</td>
                <td>${item.horario}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  // Generar el PDF
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('La función de compartir no está disponible en este dispositivo.');
  }
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Exportar Asistencias a PDF' });
}
