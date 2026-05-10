<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note;

class NoteController extends Controller
{
    // 📄 GET all notes for logged user
    public function index(Request $request)
    {
        $notes = Note::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $notes->count(),
            'data' => $notes
        ]);
    }

    // 📝 CREATE note
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'nullable',
            'priority' => 'in:low,medium,high'
        ]);

        $note = Note::create([
            'title' => $request->title,
            'content' => $request->content,
            'priority' => $request->priority ?? 'low',
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Note created successfully',
            'data' => $note
        ], 201);
    }

    // ✏️ UPDATE note
    public function update(Request $request, $id)
    {
        $note = Note::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$note) {
            return response()->json([
                'status' => 'error',
                'message' => 'Note not found'
            ], 404);
        }

        $request->validate([
            'title' => 'sometimes',
            'content' => 'nullable',
            'priority' => 'in:low,medium,high'
        ]);

        $note->update($request->only(['title', 'content', 'priority']));

        return response()->json([
            'status' => 'success',
            'message' => 'Note updated successfully',
            'data' => $note
        ]);
    }

    // 🗑️ DELETE note
    public function destroy(Request $request, $id)
    {
        $note = Note::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$note) {
            return response()->json([
                'status' => 'error',
                'message' => 'Note not found'
            ], 404);
        }

        $note->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Note deleted successfully'
        ]);
    }
}