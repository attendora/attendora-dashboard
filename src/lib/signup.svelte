<script lang="ts">
    import { teacherId, signin} from './store.js';
    import axios from 'axios';
    let teacherName: string;
    let teacherLastName: string;
    let teacherEmail: string;
    let verificationCode: string;
    let password: string;
    let rfid: string;
    let incomplete: boolean = false;
    let noemail: boolean = false;
    let promise:Promise<void>;
    let emailpromise:Promise<void>;
    let status:number;
    let emailstatus:boolean = false;	
    const authServer:string =import.meta.env.VITE_AUTH_SERVER;



    async function signup() {

        if (!teacherName || !teacherLastName || !teacherEmail || !password || !rfid || !verificationCode) {
            incomplete = true;
            return;
        }
        incomplete = false;
        if (!teacherEmail.includes("@ensam-casa.ma")) {
            noemail = true;
            return;
        }
        noemail = false;
        const response = await axios.post(authServer+'/signup',{
            "teacherName": teacherName,
            "teacherLastName": teacherLastName,
            "teacherEmail": teacherEmail,
            "password": password,
            "rfid": rfid,
            "code": verificationCode
        });
        const data = await response.data;
        
        if (response.status == 200  ) {
            signin.set(true);
            teacherId.set(data.teacherId);
        } else {
            alert(data.message);
        }
    }

    async function sendverifEmail() {
        if (!teacherEmail || !teacherEmail.includes("@ensam-casa.ma")) {
            noemail = true;
            return;
        }
        emailstatus = false;
        const response = await axios.post(authServer+'/sendverifEmail',{
            "teacherEmail": teacherEmail
        });
        const data = await response.data;
        if (response.status == 200  ) {
            emailstatus = true;
        } else {
            alert(data.message);
        }
    }
    
</script>

<style>
    .incomplete {
        color: red;
    }
</style>

<div class="signup">
    {#if incomplete}
        <p class="incomplete">Please fill out all fields</p>
    {/if}
    {#if noemail}
        <p class="incomplete">Please inter a valid ensam email</p>
    {/if}
    {#await promise}
        Signing up...
    {:catch error}
        <p class="incomplete">Something went wrong: {error.message}</p>
    {/await}
    <form on:submit|preventDefault={()=> promise = signup()}>     
        <table align="center" style="text-align: left;">
            <tr>
                <td>
                    <label for="teacherName">Teacher Name</label>
                </td>
                <td>
                    <input type="text" placeholder="Teacher Name" bind:value={teacherName} />
                </td>
            
                <td>
                    <label for="teacherLastName">Teacher Last Name</label>
                </td>
                <td>
                    <input type="text" placeholder="Teacher Last Name" bind:value={teacherLastName} />
                </td>
            </tr>
            <tr>
                <td>
                    <label for="teacherEmail">Teacher Email</label>
                </td>
                <td style="">
                    <input type="text" placeholder="Teacher Email" bind:value={teacherEmail} />
                </td>
                
                {#await emailpromise}
                    sending...
                {:then value}
                    {#if emailstatus}
                    <td>
                        <label for="verifcode">Vefication code</label>
                    </td>
                    <td>
                        <input type="text" placeholder="54A4S5" bind:value={verificationCode} />
                    </td>
                    {:else}
                    <td>
                        <a href="/" type="button" on:click|preventDefault={async () => emailpromise = sendverifEmail()}>Send verification code</a>
                    </td>
                    {/if}

                {:catch error}
                    <td style="color: red;">Error: {error.message}</td>
                {/await}

            </tr>
            <tr>
                <td>
                    <label for="password">Password</label>
                </td>
                <td>
                    <input type="password" placeholder="Password" bind:value={password} />
                </td>
                <td>
                    <label for="rfid">RFID TAG</label>
                </td>
                <td>
                    <input type="text" placeholder="RFID TAG" bind:value={rfid} />
                </td>
            </tr>
        </table>
        <br>
        <button type="submit" >Sign Up</button>
    </form>
</div>