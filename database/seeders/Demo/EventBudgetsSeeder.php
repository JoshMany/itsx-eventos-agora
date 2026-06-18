<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventBudgetsSeeder extends Seeder
{
    public function run(): void
    {
        $budgets = [
            1 => ['planned' => 50000, 'approved' => 45000],
            2 => ['planned' => 120000, 'approved' => 120000],
            3 => ['planned' => 300000, 'approved' => 280000],
        ];
        $events = DB::table('events')->orderBy('id')->pluck('id');
        $i = 1;
        foreach ($events as $eid) {
            $b = $budgets[$i] ?? ['planned' => 100000, 'approved' => 100000];
            DB::table('event_budgets')->insert(['event_id' => $eid, 'planned_amount' => $b['planned'], 'approved_amount' => $b['approved'], 'created_at' => now(), 'updated_at' => now()]);
            DB::table('event_expenses')->insert(['event_id' => $eid, 'concept' => 'Materiales y equipamiento', 'amount' => $b['planned'] * 0.4, 'expense_date' => now()->subDays(15), 'created_at' => now(), 'updated_at' => now()]);
            DB::table('event_expenses')->insert(['event_id' => $eid, 'concept' => 'Alimentos y bebidas', 'amount' => $b['planned'] * 0.25, 'expense_date' => now()->subDays(10), 'created_at' => now(), 'updated_at' => now()]);
            DB::table('event_expenses')->insert(['event_id' => $eid, 'concept' => 'Marketing y difusion', 'amount' => $b['planned'] * 0.15, 'expense_date' => now()->subDays(5), 'created_at' => now(), 'updated_at' => now()]);
            $i++;
        }
    }
}
