import { Form, Head, Link } from "@inertiajs/react";
import InputError from "@/components/input-error";
import { login } from "@/routes";
import { email } from "@/routes/password";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Recuperar Contrasena" />

            {status ? (
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950">
                        <Mail size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{status}</p>
                    <Link href={login()} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#001e38] dark:text-[#dcc355] hover:underline">
                        <ArrowLeft size={14} /> Volver al inicio de sesion
                    </Link>
                </div>
            ) : (
                <Form {...email.form()} className="flex flex-col gap-6">
                    <div className="grid gap-5">
                        <div className="grid gap-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Correo electronico
                            </label>
                            <input id="email" type="email" name="email" required autoFocus autoComplete="email" placeholder="admin@agora.test" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#001e38] dark:focus:border-[#dcc355] focus:ring-2 focus:ring-[#001e38]/10" />
                            <InputError message={(email.form().errors as any)?.email} />
                        </div>

                        <button type="submit" className="w-full rounded-lg bg-[#001e38] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]">
                            Enviar enlace de recuperacion
                        </button>
                    </div>

                    <Link href={login()} className="flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowLeft size={14} /> Volver al inicio de sesion
                    </Link>
                </Form>
            )}
        </>
    );
}