import Calendario from '@/components/landing/calendario';
import Caracteristicas from '@/components/landing/caracteristicas';
import ConsultaConstancias from '@/components/landing/consulta-constancias';
import Footer from '@/components/landing/footer';
import Galeria from '@/components/landing/galeria';
import Hero from '@/components/landing/Hero';
import NavBar from '@/components/landing/NavBar';
import ProximosEventos from '@/components/landing/proximos-eventos';
import Marquee from '@/components/landing/Marquee';

interface WelcomeProps {
    stats: {
        eventsThisYear: number;
        totalParticipants: number;
        totalCertificates: number;
        nextEvent: { title: string; starts_at: string; ends_at: string } | null;
        upcomingEvents: Array<{
            title: string;
            starts_at: string;
            ends_at: string;
            slug: string;
            available_spots: number | null;
            confirmed_count: number;
            capacity: number | null;
            location: string;
            category: string;
        }>;
        averageAttendance: number;
    };
}

export default function Welcome({ stats }: WelcomeProps) {
    return (
        <div className="min-h-screen bg-background">
            <NavBar />
            <Hero stats={stats} />
            <Marquee stats={stats} />
            <ProximosEventos upcomingEvents={stats?.upcomingEvents} />
            <Caracteristicas />
            <Calendario upcomingEvents={stats?.upcomingEvents} />
            <ConsultaConstancias />
            <Galeria />
            <Footer />
        </div>
    );
}
