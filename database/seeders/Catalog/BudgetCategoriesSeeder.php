<?php

namespace Database\Seeders\Catalog;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BudgetCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['code' => 'material', 'name' => 'Material y suministros'],
            ['code' => 'viaticos', 'name' => 'Viáticos y transporte'],
            ['code' => 'alimentos', 'name' => 'Alimentos y bebidas'],
            ['code' => 'honorarios', 'name' => 'Honorarios'],
            ['code' => 'equipo', 'name' => 'Equipo y renta'],
            ['code' => 'difusion', 'name' => 'Difusión y publicidad'],
            ['code' => 'papeleria', 'name' => 'Papelería e impresos'],
            ['code' => 'premios', 'name' => 'Premios y reconocimientos'],
            ['code' => 'tecnologia', 'name' => 'Tecnología y software'],
            ['code' => 'otros', 'name' => 'Otros'],
        ];

        foreach ($categories as $c) {
            DB::table('budget_categories')->insertOrIgnore([
                'code' => $c['code'],
                'name' => $c['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
