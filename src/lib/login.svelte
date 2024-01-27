<script lang="ts">
    import { loggedIn, sideBarSwitch, signin} from './store.js';
    import axios from 'axios';
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

    async function forgotPassword() {
        if (!teacherId) {
            incomplete = true;
            return;
        }
        incomplete = false;
        const response = await axios.post(authServer+'/forgotPassword', {
            "teacherId": teacherId
        });
        const data = await response.data
        status = response.status;

        if (data.success) {
            alert(data.message);
        } else {
            alert(data.message);
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
    <form on:submit|preventDefault={()=> promise = login()} on:reset|preventDefault={()=> promise = forgotPassword()}>
        
        <input type="text" placeholder="Teacher ID" bind:value={teacherId} />
        <br>
        <input type="password" placeholder="Password" bind:value={password} />
        <br>
        <br>
        <button type="submit">login</button>
        <button type="reset">Reset Password</button>
    </form>
</div>