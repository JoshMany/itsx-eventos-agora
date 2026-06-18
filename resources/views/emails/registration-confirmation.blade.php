<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmación de registro – ÁGORA</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#001e38;padding:32px 40px;text-align:center;">
                            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.05em;">ÁGORA</p>
                            <p style="margin:6px 0 0;font-size:12px;color:#dcc355;">Instituto Tecnológico Superior de Xalapa</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding:40px;">
                            <h1 style="margin:0 0 8px;font-size:20px;color:#111827;font-weight:600;">
                                ¡Registro confirmado!
                            </h1>
                            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                                Hola <strong>{{ $registration->participant->first_name }}</strong>,
                                tu registro para el evento ha sido confirmado exitosamente.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:24px;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Folio de registro</p>
                                        <p style="margin:0;font-size:16px;font-weight:600;color:#001e38;font-family:monospace;">{{ strtoupper(substr($registration->uuid, 0, 8)) }}</p>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">
                                Guarda este correo como comprobante de tu registro. Necesitarás presentarlo el día del evento.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
                            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                                © {{ date('Y') }} Instituto Tecnológico Superior de Xalapa · ÁGORA
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
