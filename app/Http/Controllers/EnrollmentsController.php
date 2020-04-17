<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Enrollment;

class EnrollmentsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student,teacher');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $classrooms = Enrollment::where('student_id', $request->user()->id)
            
            ->when($request->input('limit'), function ($query, $limit) {
                return $query->limit($limit);
            })

            ->when($request->input('order'), function ($query, $order) {
                if (is_array($order)) {
                    return $query->orderBy($order[0], $order[1]);
                }

                return $query->orderBy($order);
            })
        ->get();

        return response()->json($classrooms->toArray());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getCount(Request $request)
    {
        return response()->json([
            'count' => Enrollment::where('student_id', $request->user()->id)->count()
        ]);
    }
}
