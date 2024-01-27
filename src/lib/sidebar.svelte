<script lang="ts">
    import { sideBarSwitch } from './store';
</script>

<div class="Stats">
    {#if $sideBarSwitch == 1}
        <div class="choiceBox" style="background-color: cyan; color: blue; text-decoration: underline;">
            Teacher Stats
        </div>
    {:else}
        <div class="choiceBox">
            <a href="button" role="button" on:click|preventDefault={() => sideBarSwitch.set(1)}>Teacher Stats</a>
        </div>
    {/if}
    {#if $sideBarSwitch == 2}
        <div class="choiceBox" style="background-color: cyan; color: blue; text-decoration: underline;">
            Filiere Stats
        </div>
    {:else}
        <div class="choiceBox">
            <a href="button" role="button" on:click|preventDefault={() => sideBarSwitch.set(2)}>Filiere Stats</a>
        </div>
    {/if}
    {#if $sideBarSwitch == 3}
        <div class="choiceBox" style="background-color: cyan; color: blue; text-decoration: underline;">
            Students Stats
        </div>
    {:else}
        <div class="choiceBox">
            <a href="button" role="button" on:click|preventDefault={() => sideBarSwitch.set(3)}>Students Stats</a>
        </div>
    {/if}
</div>
