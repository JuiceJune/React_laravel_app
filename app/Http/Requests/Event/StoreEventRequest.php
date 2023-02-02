<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:50',
            'start' => 'required|date',
            'end' => 'required|date',
            'all_day' => 'required',
            'background_color' => 'required|string',
            'text_color' => 'required|string',
            'url' => 'nullable|url',
        ];
    }
}
