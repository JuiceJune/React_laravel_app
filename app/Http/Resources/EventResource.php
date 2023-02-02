<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
          'id' => $this->id,
          'title' => $this->title,
          'start' => $this->start,
          'end' => $this->end,
          'allDay' => $this->all_day,
          'backgroundColor' => $this->background_color,
          'borderColor' => $this->background_color,
          'textColor' => $this->text_color,
          'url' => $this->url ?: "",
        ];
    }
}
