<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $subscriptions = Subscription::all();
        return response()->json($subscriptions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:subscriptions|max:255',
            'price' => 'required|integer|min:0|max:255',
            'description' => 'required|string|max:500',
        ]);

        $subscription = Subscription::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'description' => $validated['description'],
        ]);

        return response()->json([
            'message' => 'Subscription created successfully',
            'subscription' => $subscription,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $subscription = Subscription::find($id);

        if (!$subscription) {
            return response()->json(['message' => 'Subscription not found'], 404);
        }

        return response()->json([
            'message' => 'Subscription retrieved successfully',
            'subscription' => $subscription,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'description' => 'required|string|max:500',
        ]);

        $subscription = Subscription::findOrFail($id);
        $subscription->update($validated);

        return response()->json([
            'message' => 'Subscription updated successfully',
            'subscription' => $subscription,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getSubscriptionByName($name)
    {
        $name = trim($name);

        $subscription = Subscription::where('name', $name)->first();

        if (!$subscription) {
            return response()->json(['message' => 'Subscription not found'], 404);
        }

        return response()->json([
            'subscription' => $subscription,
        ]);
    }
}
