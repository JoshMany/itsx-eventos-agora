<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Enlace de acceso – ÁGORA</title>
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
                            <h1 style="margin:0 0 16px;font-size:20px;color:#111827;font-weight:600;">Tu enlace de acceso</h1>
                            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                                Recibiste este correo porque solicitaste acceder a tu espacio personal en ÁGORA.
                                Haz clic en el botón de abajo para iniciar sesión. Este enlace es válido por <strong>15 minutos</strong>.
                            </p>
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-radius:6px;background-color:#001e38;">
                                        <a href="{{ $loginUrl }}"
                                           style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
                                            Acceder a mi espacio
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
                                Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br />
                                <a href="{{ $loginUrl }}" style="color:#001e38;word-break:break-all;">{{ $loginUrl }}</a>
                            </p>
                            <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
                                Si no solicitaste este enlace, puedes ignorar este mensaje con seguridad.
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
