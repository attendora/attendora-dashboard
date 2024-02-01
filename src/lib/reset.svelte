<script lang="ts">
    import axios from "axios";
    import { resetstatus } from "./store.js";


    const authServer:string =import.meta.env.VITE_AUTH_SERVER;

    let resetpromise:Promise<void>;
    let resetswitch:boolean = false;
    let resetEmailStatus:boolean = false;
    let resetemail:string;
    let resetcode:string;
    let resetpass:string;
    let passconfirm:string;
    let status:number;
    let incomplete:boolean;
    let confirmclass:string;
    
    async function sendresetcode() {
        incomplete = false;
        status = 0;
        if (!resetemail) {
            incomplete = true;
            return;
        }
        incomplete = false;
        if (!resetemail.includes("@ensam-casa.ma")) {
            status = 406;
            return;
        }
        incomplete = false;
        
        const response = await axios.post(authServer+'/resetPasswordemail', {
            "teacherEmail": resetemail
        });

        const data = await response.data;


        if (response.status == 200) {
            resetEmailStatus = true;
            status = 207;
        } else {
            alert(data.message);
        }
    }

    async function reset() {
        if (!resetcode || !resetpass || !passconfirm || !resetemail) {
            incomplete = true;
            return;
        }
        incomplete = false;
        if (!resetemail.includes("@ensam-casa.ma")) {
            status = 406;
            return;
        }
        if (resetpass != passconfirm) {
            status = 407;
            return;
        }
        status = 0;
        try {
        const response = await axios.post(authServer+'/resetPassword', {
            "teacherEmail": resetemail,
            "code": resetcode,
            "password": resetpass
        });

        const data = await response.data;

        if (response.status == 200) {
            status = 200;
            resetstatus.set(true);
            resetswitch = false;
        } else {
            alert(data.message);
        }
        } catch (error: any){
            alert(error);
        }
    }

</script>

<style>
    .outerShell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content:space-around;
        height: 100%;
    }
    .resetpass {
        background: #e8e8e810;
        padding: 0.5em;
        border-radius: 0.5em;
        width: fit-content;
    }
    .identical {
        border: 2px solid green;
    }
    .notIdentical {
        border: 2px solid red;
    }
    .normal {
        border: default;
    }
    input:focus {
        outline: none;
    }
</style>

<div class="outerShell">    
    <a href="button" role="button" on:click|preventDefault={() => resetswitch=!resetswitch}>reset password</a>
    <br>    
    {#if resetswitch}
        <div class="resetpass">
        <form on:submit|preventDefault={async ()=> resetpromise = reset()}>
        <input type="email" bind:value={resetemail} placeholder="surnane.name@ensam-casa.ma" />
        
        {#if !resetEmailStatus}
            <a href="button" role="button" on:click|preventDefault={async () => resetpromise = sendresetcode()}>get code</a>
        {:else}
            <input type="text" bind:value={resetcode} placeholder="JSD5SD" />
        {/if}
        
        <br>
        <input type="password" bind:value={resetpass} placeholder="new password" />
        <input type="password" class={confirmclass} bind:value={passconfirm} on:input={()=>{
            if (passconfirm!=""){
                resetpass==passconfirm?confirmclass="identical":confirmclass="notIdentical";
            } else {
                confirmclass="normal";
            }}} placeholder="confirm password" />
        <br>
        <button type="submit">reset</button>
        </form>
        {#await resetpromise}
            processing...
        {:catch Error}
            {#if Error.message.includes("wrong")}
                <p style="color: red;">wrong code</p>
            {/if}
            {#if Error.message.includes("expired")}
                <p style="color: red;">expired code</p>
            {/if}
            {#if Error.message.includes("not registered")}
                <p style="color: red;">not registered</p>
            {/if}
            {#if Error.message.includes("update")}
                <p style="color: red;">Database Error Try later</p>
            {/if}
            {#if Error.message.includes("email")}
                <p style="color: red;">email not sent</p>
            {/if}
        {/await}
        {#if status == 207}
            <p style="color: green;">email sent</p>
        {/if}
        {#if incomplete}
                <p style="color: red;">Please fill out all fields</p>
        {/if}
        {#if status == 407}
            <p style="color: red;">{"passwords don't match"}</p>
        {/if}
        {#if status == 406}
            <p style="color: red;">{"not ensam email"}</p>
        {/if}
        </div>
    {/if}
</div>