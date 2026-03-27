<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.ico";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Sem Van Broekhoven | Learning Goals</title>
    <meta
        name="description"
        content="Learning Goals Portfolio for Thomas More Geel - Digital Innovation"
    />
</svelte:head>

{@render children()}
