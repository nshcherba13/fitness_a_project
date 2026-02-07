<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Account;
use App\Models\Admin;
use App\Models\Subscription;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AccountControllerTest extends TestCase
{

    /**
     * A basic feature test example.
     */

    protected $user;
    protected $account;
    protected $adminUser;
    protected $admin;

    protected function setUp(): void {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->account = Account::factory()->create(['user_id' => $this->user->id]);

        $this->adminUser = User::factory()->create();
        $this->admin = Admin::factory()->create(['user_id' => $this->adminUser->id]);
    }

    protected function authenticateAsUser() {
        $this->actingAs($this->user);
    }

    protected function authenticateAsAdmin() {
        $this->actingAs($this->adminUser);
    }


    public function test_user_can_see_his_own_account_info() {
        $this->authenticateAsUser();

        $response = $this->getJson('/api/account/info');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'account' => [
                'age', 'weight', 'height',
            ],
            'user' => [
                'name', 'email',
            ],
        ]);

        $this->assertEquals($this->account->age, $response->json('account.age'));
    }

    public function test_guest_cannot_access_account_info() {
        $response = $this->getJson('/api/account/info');

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_user_can_update_account_info() {
        $this->authenticateAsUser();

        $updateData = [
            'age' => 30,
            'weight' => 75,
            'height' => 180,
            'name' => 'Updated Name',
        ];

        $response = $this->putJson('/api/account/update', $updateData);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Account updated successfully',
        ]);

        $this->assertDatabaseHas('accounts', [
            'user_id' => $this->user->id,
            'age' => 30,
            'weight' => 75,
            'height' => 180,
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name',
        ]);
    }


    public function test_user_with_valid_subscription_can_write_to_trainer()
    {
        $this->authenticateAsUser();

        $updateData = ['subscription_id' => 3];
        $updateResponse = $this->putJson('/api/account/update-subscription', $updateData);

        $updateResponse->assertStatus(200)
            ->assertJson(['message' => 'Subscription updated successfully']);

        $this->assertDatabaseHas('accounts', [
            'user_id' => $this->user->id,
            'subscription_id' => 3,
        ]);

        $response = $this->getJson('/api/account/can-write-to-trainer');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'User is able to write to trainer',
                'is_able_to_write' => true,
            ]);
    }


    public function test_user_can_delete_account() {
        $this->authenticateAsUser();

        $response = $this->deleteJson('/api/account/destroy');

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Account deleted successfully']);

        $this->assertDatabaseMissing('accounts', ['account_id' => $this->account->account_id]);
        $this->assertDatabaseHas('users', ['id' => $this->user->id]);
    }

    public function test_user_can_see_training_plans() {
        $trainingPlans = $this->account->trainingPlans()->createMany([
            [
                'title' => 'Plan 1',
                'description' => 'Description 1',
                'goal' => 'gain_weight',
                'level' => 'Beginner',
                'created_by' => $this->admin->admin_id,
            ],
            [
                'title' => 'Plan 2',
                'description' => 'Description 2',
                'goal' => 'gain_weight',
                'level' => 'Intermediate',
                'created_by' => $this->admin->admin_id,
            ],
        ]);

        $this->authenticateAsUser();

        $response = $this->getJson('/api/account/training-plans');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'account_id',
            'training_plans' => [
                '*' => ['training_plan_id', 'title', 'description', 'goal', 'level'],
            ],
        ]);

        $this->assertCount(2, $response->json('training_plans'));
    }

    public function test_non_admin_cannot_access_account_list() {
        $this->authenticateAsUser();

        $response = $this->getJson('/api/accounts');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Access denied']);
    }


    public function test_user_with_invalid_subscription_cannot_write_to_trainer() {
        $this->authenticateAsUser();
        $updateData = ['subscription_id' => 2];
        $updateResponse = $this->putJson('/api/account/update-subscription', $updateData);

        $updateResponse->assertStatus(200)
            ->assertJson(['message' => 'Subscription updated successfully']);

        $this->assertDatabaseHas('accounts', [
            'user_id' => $this->user->id,
            'subscription_id' => 2,
        ]);

        $response = $this->getJson('/api/account/can-write-to-trainer');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'User is not allowed to write to trainer',
                'is_able_to_write' => false,
            ]);
    }

    public function test_user_cannot_see_training_plans_without_account() {
        $newUser = User::factory()->create();
        $this->actingAs($newUser);

        $response = $this->getJson('/api/account/training-plans');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Access denied']);
    }

    public function test_admin_can_access_account_list() {
        $initialCount = Account::count();

        $this->authenticateAsAdmin();

        $response = $this->getJson('/api/accounts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'accounts' => [
                    '*' => ['account_id', 'user_id', 'age', 'weight', 'height', 'gender', 'fitness_level', 'subscription_id'],
                ],
            ]);

        $this->assertCount($initialCount, $response->json('accounts'));
    }

    public function test_admin_gets_404_when_account_not_found() {
        $this->authenticateAsAdmin();

        $nonExistentId = $this->account->account_id + 999;

        $response = $this->getJson('/api/accounts/show?id=' . $nonExistentId);

        $response->assertStatus(404)
            ->assertJson(['message' => 'User not found']);
    }


    public function test_non_admin_cannot_view_account_details() {
        $this->authenticateAsUser();

        $response = $this->getJson('/api/accounts/show?id=' . $this->account->account_id);

        $response->assertStatus(403)
            ->assertJson(['message' => 'Access denied']);
    }

    public function test_user_cannot_update_account_with_invalid_data(){
        $this->authenticateAsUser();

        $updateData = [
            'age' => 10,
            'email' => 'not-an-email',
        ];

        $response = $this->putJson('/api/account/update', $updateData);

        $response->assertStatus(400)
            ->assertJsonStructure(['message']);
    }

    public function test_user_cannot_delete_without_account(){
        $newUser = User::factory()->create();
        $this->actingAs($newUser);

        $response = $this->deleteJson('/api/account/destroy');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Access denied']);
    }

    public function test_user_cannot_write_to_trainer_without_account(){
        $newUser = User::factory()->create();
        $this->actingAs($newUser);

        $response = $this->getJson('/api/account/can-write-to-trainer');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Access denied']);
    }

    public function test_user_cannot_update_info_without_account(){
        $newUser = User::factory()->create();
        $this->actingAs($newUser);

        $updateData = [
            'age' => 30,
        ];

        $response = $this->putJson('/api/account/update', $updateData);

        $response->assertStatus(403)
            ->assertJson(['message' => 'Access denied']);
    }

    public function test_user_cannot_view_info_without_account(){
        $newUser = User::factory()->create();
        $this->actingAs($newUser);

        $response = $this->getJson('/api/account/info');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Access denied']);
    }

    public function test_user_can_update_subscription(){
        $this->authenticateAsUser();

        $updateData = ['subscription_id' => 3];

        $response = $this->putJson('/api/account/update-subscription', $updateData);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Subscription updated successfully']);

        $this->assertDatabaseHas('accounts', [
            'user_id' => $this->user->id,
            'subscription_id' => 3,
        ]);
    }

    public function test_user_cannot_update_subscription_with_invalid_id(){
        $this->authenticateAsUser();

        $updateData = ['subscription_id' => 99999];

        $response = $this->putJson('/api/account/update-subscription', $updateData);

        $response->assertStatus(400)
            ->assertJson(['message' => 'Invalid subscription ID']);

        $this->assertDatabaseHas('accounts', [
            'user_id' => $this->user->id,
            'subscription_id' => $this->account->subscription_id,
        ]);
    }

    public function test_user_cannot_update_subscription_without_account(){
        $newUser = User::factory()->create();
        $this->actingAs($newUser);

        $updateData = ['subscription_id' => 1];

        $response = $this->putJson('/api/account/update-subscription', $updateData);

        $response->assertStatus(404)
            ->assertJson(['message' => 'Account not found']);
    }

    public function test_show_users_to_trainers(){
        $this->authenticateAsAdmin();

        $response = $this->getJson('/api/account/showUsersToTrainers');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'message',
            'accountIds' => [
                '*' => [
                    'account_id',
                    'user_id',
                    'user_name',
                ],
            ],
        ]);

        $response->assertJsonFragment([
            'account_id' => $this->account->account_id,
            'user_id' => $this->account->user_id,
            'user_name' => $this->user->name,
        ]);
    }

}


