<nav {{ isset($id) ? 'id="'. $id .'"' : '' }} class="{{ $class }}">
    {{--- $item will contain ['route' => '', 'title' => '', 'icon' => ''] ---}}
    @foreach ($items as $item)
        @include('includes.sideNavItem', $item)
    @endforeach
</nav>