import Calendario from '@/components/public/calendario';
import Caracteristicas from '@/components/public/caracteristicas';
import ConsultaConstancias from '@/components/public/consulta-constancias';
import Footer from '@/components/public/footer';
import Galeria from '@/components/public/galeria';
import Hero from '@/components/public/hero';
import NavBar from '@/components/public/navbar';
import ProximosEventos from '@/components/public/proximos-eventos';
import TickerBanner from '@/components/public/ticker-banner';

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
            <TickerBanner stats={stats} />
            <ProximosEventos upcomingEvents={stats?.upcomingEvents} />
            <Caracteristicas />
            <Calendario upcomingEvents={stats?.upcomingEvents} />
            <ConsultaConstancias />
            <Galeria />
            <Footer />
        </div>
    );
}
