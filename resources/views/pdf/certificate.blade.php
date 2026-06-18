<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Constancia — {{ $certificate->folio }}</title>
    <style>
        @page {
            margin: 0;
            size: letter landscape;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Geist Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            width: 100%;
            height: 100%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .certificate {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0;
            background: #ffffff;
            overflow: hidden;
        }

        /* Top gold bar */
        .top-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 14px;
            background: linear-gradient(90deg, #001e38 0%, #dcc355 50%, #001e38 100%);
        }

        /* Bottom gold bar */
        .bottom-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 14px;
            background: linear-gradient(90deg, #001e38 0%, #dcc355 50%, #001e38 100%);
        }

        /* Outer border frame */
        .frame {
            position: absolute;
            inset: 28px;
            border: 1.5px solid #001e38;
            border-radius: 6px;
            pointer-events: none;
        }

        /* Inner decorative border */
        .frame::before {
            content: '';
            position: absolute;
            inset: 10px;
            border: 1px solid #dcc355;
            border-radius: 3px;
            pointer-events: none;
        }

        /* Corner ornaments */
        .corner {
            position: absolute;
            width: 32px;
            height: 32px;
            border-color: #dcc355;
            border-style: solid;
        }
        .corner-tl { top: 38px; left: 38px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 38px; right: 38px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 38px; left: 38px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 38px; right: 38px; border-width: 0 2px 2px 0; }

        /* Watermark */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 140px;
            font-weight: 900;
            color: rgba(0, 30, 56, 0.035);
            pointer-events: none;
            letter-spacing: 16px;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            padding: 60px 100px 50px;
            width: 100%;
        }

        /* ITSX header */
        .header {
            text-align: center;
            margin-bottom: 28px;
        }

        .header .institution {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #001e38;
            margin-bottom: 4px;
        }

        .header .title {
            font-size: 10px;
            font-weight: 500;
            color: #5a5a5a;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        /* Gold divider */
        .divider {
            width: 120px;
            height: 2px;
            background: #dcc355;
            margin: 20px 0;
        }

        /* Certificate type badge */
        .badge {
            display: inline-block;
            padding: 8px 32px;
            background: #001e38;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 5px;
            text-transform: uppercase;
            margin-bottom: 16px;
        }

        .body-text {
            text-align: center;
            max-width: 600px;
        }

        .body-text .otorga {
            font-size: 12px;
            color: #4a4a4a;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 6px;
        }

        .body-text .participant-name {
            font-size: 32px;
            font-weight: 800;
            color: #001e38;
            margin: 10px 0;
            line-height: 1.2;
        }

        .body-text .participation-text {
            font-size: 12px;
            color: #4a4a4a;
            margin-bottom: 6px;
        }

        .body-text .event-name {
            font-size: 20px;
            font-weight: 700;
            color: #001e38;
            margin: 6px 0;
        }

        .body-text .detail {
            font-size: 11px;
            color: #666;
            margin-top: 6px;
        }

        .body-text .date-range {
            font-size: 11px;
            color: #4a4a4a;
            margin-top: 10px;
            font-weight: 500;
        }

        .footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 30px;
            margin-top: auto;
        }

        .footer .qr-section {
            text-align: center;
        }

        .footer .qr-section img {
            width: 80px;
            height: 80px;
        }

        .footer .qr-section .folio {
            font-size: 9px;
            font-weight: 700;
            color: #001e38;
            margin-top: 3px;
            font-family: 'Geist Mono', 'Courier New', monospace;
            letter-spacing: 0.5px;
        }

        .footer .qr-section .verify-text {
            font-size: 7px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1px;
        }

        .footer .signature-area {
            text-align: center;
        }

        .footer .signature-area .line {
            width: 220px;
            height: 1px;
            background: #001e38;
            margin-bottom: 5px;
        }

        .footer .signature-area .role {
            font-size: 9px;
            color: #4a4a4a;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .footer .signature-area .name {
            font-size: 10px;
            font-weight: 600;
            color: #001e38;
            margin-bottom: 1px;
        }

        .footer-left {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }

        .footer-left .itsx-ref {
            font-size: 8px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="certificate">
        {{-- Top / Bottom bars --}}
        <div class="top-bar"></div>
        <div class="bottom-bar"></div>

        {{-- Frame --}}
        <div class="frame">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
        </div>

        {{-- Watermark --}}
        <div class="watermark">ITSX</div>

        {{-- Content --}}
        <div class="content">
            {{-- Header --}}
            <div class="header">
                <p class="institution">
                    Instituto Tecnológico Superior de Xalapa
                </p>
                <p class="title">
                    Plataforma Institucional de Eventos y Actividades
                </p>
            </div>

            <div class="divider"></div>

            {{-- Badge --}}
            <div class="badge">
                {{ $certificateType->name }}
            </div>

            {{-- Body --}}
            <div class="body-text">
                <p class="otorga">Otorga la presente constancia a</p>

                <p class="participant-name">
                    {{ $participant->first_name }} {{ $participant->last_name }}
                </p>

                <p class="participation-text">
                    Por su {{ $certificateType->name === 'Asistencia' || $certificateType->code === 'attendance' ? 'asistencia' : 'participación' }} en
                </p>

                <p class="event-name">{{ $event->title }}</p>

                @if ($activity)
                    <p class="detail">{{ $activity->title }} — {{ \Carbon\Carbon::parse($activity->starts_at)->format('d/m/Y') }}</p>
                @endif

                <p class="date-range">
                    Evento realizado del {{ \Carbon\Carbon::parse($event->starts_at)->format('d/m/Y') }}
                    al {{ \Carbon\Carbon::parse($event->ends_at)->format('d/m/Y') }}.
                </p>

                <p class="detail" style="margin-top: 14px;">
                    Folio: {{ $certificate->folio }}
                </p>
            </div>

            {{-- Footer --}}
            <div class="footer">
                <div class="qr-section">
                    <img src="{{ $qrCodeDataUri }}" alt="Código QR de validación" />
                    <p class="folio">{{ $certificate->folio }}</p>
                    <p class="verify-text">Valide en constancias.itsx.edu.mx</p>
                </div>

                <div class="signature-area">
                    <p class="name">M.A. Juan Pérez López</p>
                    <div class="line"></div>
                    <p class="role">Dirección General del ITSX</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

