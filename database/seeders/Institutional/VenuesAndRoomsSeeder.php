<?php

namespace Database\Seeders\Institutional;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VenuesAndRoomsSeeder extends Seeder
{
    public function run(): void
    {
        $campusId = DB::table('venues')->insertGetId([
            'name' => 'ITSX Campus Central', 'address' => 'Av. Universidad S/N, Col. Santa Barbara',
            'city' => 'Xalapa', 'state' => 'Veracruz', 'capacity' => 3000,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $hotelId = DB::table('venues')->insertGetId([
            'name' => 'Hotel Xalapa', 'address' => 'Av. Avila Camacho 123', 'city' => 'Xalapa', 'state' => 'Veracruz',
            'capacity' => 500, 'created_at' => now(), 'updated_at' => now(),
        ]);
        $museoId = DB::table('venues')->insertGetId([
            'name' => 'Museo de Antropologia de Xalapa', 'address' => 'Av. Xalapa 3101', 'city' => 'Xalapa', 'state' => 'Veracruz',
            'capacity' => 200, 'created_at' => now(), 'updated_at' => now(),
        ]);

        $rooms = [
            ['venue_id' => $campusId, 'name' => 'Auditorio ITSX', 'capacity' => 500],
            ['venue_id' => $campusId, 'name' => 'Sala Magna', 'capacity' => 200],
            ['venue_id' => $campusId, 'name' => 'Laboratorio de Redes', 'capacity' => 30],
            ['venue_id' => $campusId, 'name' => 'Laboratorio de Programacion', 'capacity' => 30],
            ['venue_id' => $campusId, 'name' => 'Laboratorio de Cisco', 'capacity' => 25],
            ['venue_id' => $campusId, 'name' => 'Cancha Principal', 'capacity' => 1000],
            ['venue_id' => $campusId, 'name' => 'Aula A-101', 'capacity' => 40],
            ['venue_id' => $campusId, 'name' => 'Aula A-102', 'capacity' => 40],
            ['venue_id' => $campusId, 'name' => 'Aula B-201', 'capacity' => 35],
            ['venue_id' => $campusId, 'name' => 'Aula C-301', 'capacity' => 35],
            ['venue_id' => $campusId, 'name' => 'Sala de Usos Multiples', 'capacity' => 80],
            ['venue_id' => $campusId, 'name' => 'Centro de Computo', 'capacity' => 45],
            ['venue_id' => $hotelId, 'name' => 'Salon Veracruz', 'capacity' => 300],
            ['venue_id' => $hotelId, 'name' => 'Salon Xalapa', 'capacity' => 150],
            ['venue_id' => $museoId, 'name' => 'Auditorio del MAX', 'capacity' => 120],
        ];
        foreach ($rooms as $r) {
            DB::table('rooms')->insertOrIgnore([
                'venue_id' => $r['venue_id'], 'name' => $r['name'],
                'capacity' => $r['capacity'], 'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
