<script lang="ts">
    import { loggedIn, sideBarSwitch, resetstatus} from './store.js';
    import axios from 'axios';
    import Reset from './reset.svelte';

    let teacherId: string;
    let password: string;
    let incomplete: boolean = false;
    const authServer:string =import.meta.env.VITE_AUTH_SERVER;
    let promise:Promise<void>;
    let status:number;

    

    async function login() {
        if (!teacherId || !password) {
            incomplete = true;
            return;
        }
        incomplete = false;
        const response = await axios.post(authServer+'/login', {
            "teacherId": teacherId,
            "password": password
        });

        const data = await response.data;
        

        if (response.status == 200) {
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('teacherId', teacherId);
            loggedIn.set(true);
            sideBarSwitch.set(0);
        } else {
            alert(data.message);
            status = response.status;
        }
    }




</script>

<div class="login">
    {#await promise}
    processing...
    {:catch error}
        {#if error.message.includes(401)}
        <p style="color: red">wrong credentials
        {/if}
        {#if error.message.includes(404)}
        <p style="color: red">Not registered Please Signup!
        {/if}
    {/await}
    {#if incomplete}
        <p style="color: red;">Please fill out all fields</p>
    {/if}
    {#if $resetstatus}
        <p style="color: green;">Password reset successfully! Please login with your new password</p>
    {/if}
    <form on:submit|preventDefault={()=> promise = login()}>
        
        <input type="text" placeholder="Teacher ID" bind:value={teacherId} />
        <br>
        <input type="password" placeholder="Password" bind:value={password} />
        <br>
        <br>
        <button type="submit">login</button>
        <br>
    </form>
    <br>
    <Reset />
</div>