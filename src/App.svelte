<script lang="ts">
    import axios from 'axios';
    import {beforeUpdate, onMount} from 'svelte';
    import {signin, loggedIn, teacherId, sideBarSwitch}  from './lib/store.js';
    import Signup from './lib/signup.svelte';
    import Login from './lib/login.svelte';
    import Sidebar from './lib/sidebar.svelte';
    import FiliereCount from './lib/dashboard/filiereCount.svelte';
    import StudentCount from './lib/dashboard/studentCount.svelte';
    import Rfid from './lib/dashboard/rfid.svelte';
  import SchoolDailyAbsense from './lib/dashboard/charts/schoolDailyAbsense.svelte';
    let needsrefresh:boolean = false;
    let promise:Promise<void>;
    let authServer:string =import.meta.env.VITE_AUTH_SERVER;
    let apiServer:string =import.meta.env.VITE_API_SERVER;

    beforeUpdate(
        async () => {
        if ($loggedIn){
            try {
                const verify = await axios.post(authServer+"/expiry",{
                    token: localStorage.getItem('token')
                });
                } catch (Error: any) {
                    if (Error.message.includes(401)) {
                        needsrefresh = true;
                        try {
                            const refresh = await axios.post(authServer+'/token', {
                                rftoken : localStorage.getItem('refreshToken'),
                                teacherId : localStorage.getItem('teacherId')
                            });
                            if (refresh.status == 200) {
                            localStorage.setItem('token', refresh.data.accessToken);
                            needsrefresh = false;
                            } else {
                                alert("please login again");
                            }
                        } catch (error: any) {
                            if (error.message.includes(404)) {
                                localStorage.removeItem('token');
                                localStorage.removeItem('refreshToken');
                                localStorage.removeItem('teacherId');
                                loggedIn.set(false);
                                teacherId.set(0);
                                needsrefresh = false;
                            } else {
                                alert(error.message);
                            }
                        }
                    }
                }
        }
    }
    );

    signin.set(true);

    $:loginswitch = !$signin;
    loggedIn.set(localStorage.getItem('token') != null && localStorage.getItem('refreshToken') != null && localStorage.getItem('teacherId') != null);

    async function logout() {
        const response = await axios.post(authServer+'/logout', {
            rftoken : localStorage.getItem('refreshToken'),
            token : localStorage.getItem('token')
        });
        const data = await response.data;
        if (response.status < 300) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('teacherId');
            loggedIn.set(false);
            teacherId.set(0);
        } else {
            alert("server error: not logged out");
        }
    }
</script>

<style>
    .identification {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }
    .dashboard {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-content: center;
        align-self: center;
        align-items: center;
        padding: 0;
        margin: 0;
    }
    .main {
        width: 80%;
        height: 100%;
        float: left;
        align-content: top;
        align-self: start;
        align-items: left;
        padding: 0;
        margin: 0;
    }
    .sidebar {
        width: 20%;
        height: 100%;
        float: left;
        align-content: left;
        align-self: start;
        align-items: left;
        margin: 0;
        padding: 1em;
    }
</style>

<!-- <Rfid></Rfid> -->

{#if (!$loggedIn) }
    <div class="identification">
    <h1>ATTENDORA DASHBOARD</h1>
    <br>
    <br>
    {#if !$signin }
        <Signup/>
        <h5>already have an account?</h5>
    {:else}
        {#if $teacherId > 0 }
            <h5>Account created successfully</h5>
            <h5>your teacher id is: {$teacherId}</h5>
        {/if}
        <Login/>
        <h5>Don't have an account yet?</h5>
    {/if}
    <a href="button" role="button" on:click|preventDefault={() => signin.set(loginswitch)}>
        {#if $signin}
            Sign Up
        {:else}
            Login
        {/if}
    </a>
    </div>
{:else}
    {#if !needsrefresh}
    <div class="dashboard">
        <div class="sidebar">
            {#await axios.post(apiServer+'/teachername', {
                teacherId: localStorage.getItem('teacherId'),
                token: localStorage.getItem('token')
              }
            )
            }
                <h2>Hello,</h2>
            
            {:then response}
                <h2>Hello Professor, {@html "<br>"} {response.data.Prenom_E} {response.data.Nom_E}</h2>

            {:catch error}
                {#if error.message.includes(401)}
                    <p style="color: red">Something Wrong! Refresh</p>
                {:else if error.message.includes(403)}
                    <p style="color: red">Something Wrong! Logout and Login again</p>
                {:else}
                   <h2>Error: {error.message}</h2>
                {/if}
            {/await}
            <div class="logout" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; ">
                <button on:click={()=>promise = logout()}>Logout
                </button>
                {#await promise}
                    <p>Logging out...</p>
                {:catch error}
                    <p style="color: red">{error.message}</p>
                {/await}
                <br>
            </div>
            <br>
            <Sidebar/>
            <br>
            {#if $sideBarSwitch != 0}
                <div class="choiceBox">
                    <a href="button" role="button" on:click|preventDefault={() => sideBarSwitch.set(0)}>Back to Main{">>"}</a>
                </div>
            {/if}
        </div>
        <div class="main">
            <div class="header">
                <h1>ATTENDORA DASHBOARDi</h1>           
            </div>
            <h1>School Stats</h1>
            <div class="quickStats" style="display: flex;">
                {#if $sideBarSwitch == 0}
                    <FiliereCount/>
                    <StudentCount/>
                    <SchoolDailyAbsense/>
                {/if}
            </div>
            <div class="graphs">
                
            </div>
        </div>
    </div>
    {/if}
{/if}

