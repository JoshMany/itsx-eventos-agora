<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventBudget;
use App\Models\EventExpense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/budgets/index', [
            'budgets' => EventBudget::query()
                ->with('event')
                ->orderByDesc('created_at')
                ->paginate(20),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'event_id' => 'required|exists:events,id',
            'planned_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        EventBudget::query()->create($data);

        return redirect()->back()->with('success', 'Presupuesto creado.');
    }

    public function update(Request $request, string $event, string $budgetId): RedirectResponse
    {
        $budget = EventBudget::query()->findOrFail($budgetId);

        $data = $request->validate([
            'planned_amount' => 'sometimes|numeric|min:0',
            'approved_amount' => 'sometimes|numeric|min:0|nullable',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:draft,submitted,approved,rejected',
        ]);

        $budget->update($data);

        return redirect()->back()->with('success', 'Presupuesto actualizado.');
    }

    public function destroy(string $id): RedirectResponse
    {
        EventBudget::query()->findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Presupuesto eliminado.');
    }

    public function storeExpense(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'event_id' => 'required|exists:events,id',
            'budget_category_id' => 'nullable|exists:budget_categories,id',
            'concept' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'quantity' => 'nullable|integer|min:1',
            'unit_price' => 'nullable|numeric|min:0',
            'expense_date' => 'nullable|date',
            'vendor_name' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:100',
            'over_budget_note' => 'nullable|string|max:500',
        ]);

        $this->checkBudgetLimit((int) $data['event_id'], (float) $data['amount'], $data['over_budget_note'] ?? null);

        EventExpense::query()->create($data);

        return redirect()->back()->with('success', 'Gasto registrado.');
    }

    public function updateExpense(Request $request, string $event, string $expenseId): RedirectResponse
    {
        $expense = EventExpense::query()->withTrashed()->findOrFail($expenseId);

        // Restore if soft-deleted (migrated from old delete behavior)
        if ($expense->trashed()) {
            $expense->deleted_by = null;
            $expense->restore();
        }

        $data = $request->validate([
            'budget_category_id' => 'nullable|exists:budget_categories,id',
            'concept' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'sometimes|numeric|min:0',
            'quantity' => 'nullable|integer|min:1',
            'unit_price' => 'nullable|numeric|min:0',
            'expense_date' => 'nullable|date',
            'vendor_name' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:100',
            'status' => 'sometimes|in:pending,paid,cancelled',
            'over_budget_note' => 'nullable|string|max:500',
        ]);

        // Only check budget limits when the amount is being changed
        if (isset($data['amount'])) {
            $this->checkBudgetLimit((int) $expense->event_id, (float) $data['amount'], $data['over_budget_note'] ?? null, $expense->id);
        }

        $expense->update($data);

        return redirect()->back()->with('success', 'Gasto actualizado.');
    }

    private function checkBudgetLimit(int $eventId, float $amount, ?string $overBudgetNote, ?int $excludeExpenseId = null): void
    {
        $budget = EventBudget::query()->where('event_id', $eventId)->first();

        if (! $budget) {
            return;
        }

        $limit = (float) ($budget->approved_amount ?? $budget->planned_amount ?? 0);

        if ($limit <= 0) {
            return;
        }

        $currentTotal = EventExpense::query()
            ->where('event_id', $eventId)
            ->where('status', '!=', 'cancelled')
            ->when($excludeExpenseId, fn ($q) => $q->where('id', '!=', $excludeExpenseId))
            ->sum('amount');

        $newTotal = $currentTotal + $amount;
        $overBy = $newTotal - $limit;

        if ($overBy > 0) {
            $percentOver = round(($overBy / $limit) * 100, 1);

            if ($percentOver > 20 && empty($overBudgetNote)) {
                abort(422, 'Se requiere una justificación para gastos que exceden el presupuesto en más del 20%.');
            }
        }
    }

    public function destroyExpense(Request $request, string $event, string $expenseId): RedirectResponse
    {
        $expense = EventExpense::query()->findOrFail($expenseId);

        if ($expense->status === 'paid') {
            return redirect()->back()->with('error', 'No se puede eliminar un gasto que ya fue pagado. Solo puedes cancelarlo.');
        }

        $user = $request->user();
        $expense->deleted_by = $user?->id;
        $expense->save();
        $expense->delete();

        return redirect()->back()->with('success', 'Gasto eliminado.');
    }

    public function restoreExpense(Request $request, string $event, string $expenseId): RedirectResponse
    {
        $expense = EventExpense::query()->withTrashed()->findOrFail($expenseId);
        $expense->deleted_by = null;
        $expense->save();
        $expense->restore();

        return redirect()->back()->with('success', 'Gasto restaurado.');
    }
}
