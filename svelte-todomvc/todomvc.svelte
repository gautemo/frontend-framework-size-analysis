<script>
	const ENTER_KEY = 13;
	const ESCAPE_KEY = 27;

	const STORAGE_KEY = 'todos-svelte'

	let currentFilter = 'all';
	let items = [];
	let editing = null;

	try {
		items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
	} catch (err) {
		items = [];
	}

	const updateView = () => {
		currentFilter = 'all';
		if (window.location.hash === '#/active') {
			currentFilter = 'active';
		} else if (window.location.hash === '#/completed') {
			currentFilter = 'completed';
		}
	};

	window.addEventListener('hashchange', updateView);
	updateView();

	function clearCompleted() {
		items = items.filter(item => !item.completed);
	}

	function remove(index) {
		items = items.slice(0, index).concat(items.slice(index + 1));
	}

	function toggleAll(event) {
		items = items.map(item => ({
			id: item.id,
			description: item.description,
			completed: event.target.checked
		}));
	}

	function createNew(event) {
		if (event.which === ENTER_KEY) {
			items = items.concat({
				id: Date.now(),
				description: event.target.value,
				completed: false
			});
			event.target.value = '';
		}
	}

	function handleEdit(event) {
		if (event.which === ENTER_KEY) event.target.blur();
		else if (event.which === ESCAPE_KEY) editing = null;
	}

	function submit(event) {
		if(editing != null) {
      const desc = event.target.value.trim()
      if(desc) {
        items[editing].description = desc;
      } else {
        remove(editing)
      }
      editing = null;
    }
	}
	
	$: filtered = currentFilter === 'all'
		? items
		: currentFilter === 'completed'
			? items.filter(item => item.completed)
			: items.filter(item => !item.completed);

	$: numActive = items.filter(item => !item.completed).length;
	$: numCompleted = items.filter(item => item.completed).length;

	$: try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch (err) {
		// noop
	}
</script>

<header class="header">
	<h1>todos</h1>
	<input
		class="new-todo"
		on:keydown={createNew}
		placeholder="What needs to be done?"
		autofocus
	>
</header>

{#if items.length > 0}
	<section class="main">
		<input id="toggle-all" class="toggle-all" type="checkbox" on:change={toggleAll} checked="{numCompleted === items.length}">
		<label for="toggle-all">Mark all as complete</label>

		<ul class="todo-list">
			{#each filtered as item, index (item.id)}
				<li class="{item.completed ? 'completed' : ''} {editing === index ? 'editing' : ''}">
					<div class="view">
						<input class="toggle" type="checkbox" bind:checked={item.completed}>
						<label on:dblclick="{() => editing = index}">{item.description}</label>
						<button on:click="{() => remove(index)}" class="destroy">x</button>
					</div>

					{#if editing === index}
						<input
							value='{item.description}'
							id="edit"
							class="edit"
							on:keydown={handleEdit}
							on:blur={submit}
							autofocus
						>
					{/if}
				</li>
			{/each}
		</ul>

		<footer class="footer">
			<span class="todo-count">
				<strong>{numActive}</strong> {numActive === 1 ? 'item' : 'items'} left
			</span>

			<ul class="filters">
				<li><a class="{currentFilter === 'all' ? 'selected' : ''}" href="#/">All</a></li>
				<li><a class="{currentFilter === 'active' ? 'selected' : ''}" href="#/active">Active</a></li>
				<li><a class="{currentFilter === 'completed' ? 'selected' : ''}" href="#/completed">Completed</a></li>
			</ul>

			{#if numCompleted}
				<button class="clear-completed" on:click={clearCompleted}>
					Clear completed
				</button>
			{/if}
		</footer>
	</section>
{/if}