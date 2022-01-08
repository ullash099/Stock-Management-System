<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->unique()->name();
        return [
            'name'          =>  $name,
            'slug'          =>  Str::slug($name), 
            'description'   =>  $this->faker->text(),
            'created_by'    =>  0
        ];
    }
}
