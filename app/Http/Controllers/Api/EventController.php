<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        return EventResource::collection($request->user()->events()->get());
    }

    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();

        $data['user_id'] = $request->user()->id;

        $event = Event::create($data);

        return response(new EventResource($event), 201);
    }

    public function show(Event $event)
    {
        return new EventResource($event);
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $data = $request->validated();

        $data['user_id'] = $request->user()->id;

        $event->update($data);

        return new EventResource($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response("", 204);
    }
}
