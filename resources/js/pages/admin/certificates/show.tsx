import { Head, Link } from '@inertiajs/react';
import { Award } from 'lucide-react';

export default function CertificateShow({ certificate }: any) {
    return (
        <div>
            <Head title={`Constancia ${certificate.folio}`} />
            <div className="mx-auto max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link
                        href="/admin/certificates"
                        className="hover:text-gray-600"
                    >
                        Constancias
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600">{certificate.folio}</span>
                </div>
                <div className="rounded-xl border bg-white p-6 text-center dark:bg-gray-900">
                    <Award size={48} className="mx-auto mb-4 text-[#dcc355]" />
                    <h2 className="text-xl font-semibold">
                        Constancia de Participacion
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">Otorgada a</p>
                    <p className="mt-1 text-lg font-semibold">
                        {certificate.first_name} {certificate.last_name}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                        {certificate.event_title}
                    </p>
                    <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="text-xs text-gray-400">Folio</dt>
                            <dd className="font-mono font-medium">
                                {certificate.folio}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-400">Generada</dt>
                            <dd>
                                {certificate.generated_at
                                    ? new Date(
                                          certificate.generated_at,
                                      ).toLocaleDateString('es-MX')
                                    : '—'}
                            </dd>
                        </div>
                        <div className="col-span-2">
                            <dt className="text-xs text-gray-400">
                                Código de verificación
                            </dt>
                            <dd className="mt-1 rounded-lg bg-gray-50 p-3 font-mono text-[11px] break-all text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                {certificate.verification_code}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-400">Email</dt>
                            <dd>{certificate.email}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-400">
                                Descargar PDF
                            </dt>
                            <dd>
                                <a
                                    href={`/admin/certificates/${certificate.uuid}/download`}
                                    className="text-[#001e38] hover:underline dark:text-[#dcc355]"
                                >
                                    {certificate.folio}.pdf
                                </a>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
