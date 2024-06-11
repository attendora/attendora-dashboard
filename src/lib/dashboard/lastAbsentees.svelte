<script lang="ts">
    import axios from "axios";
    let apiServer:string =import.meta.env.VITE_API_SERVER;
</script>

<div style="width: 80%; justify-content: center;" >
    <h2>Last Absentees</h2>
    {#await axios.post(apiServer+"/lastAbsentees",{
        token: localStorage.getItem('token'),
        teacherId: localStorage.getItem('teacherId')
    })}
        loading...
    {:then response}
        <table style="width: 80%; border-collapse: collapse;">
            <thead>
            <tr style="background-color: #e8e8e8; color: black">
                <th style="padding: 10px; border-bottom: 1px solid;">ID</th>
                <th style="padding: 10px; border-bottom: 1px solid;">Name</th>
                <th style="padding: 10px; border-bottom: 1px solid;">Surname</th>
                <th style="padding: 10px; border-bottom: 1px solid;">Major</th>
                <th style="padding: 10px; border-bottom: 1px solid;">Element</th>
                <th style="padding: 10px; border-bottom: 1px solid;">Date</th>
            </tr>
            </thead>
            <tbody>
                {#if response.data.length == 0}
                    <tr>
                        <td colspan="6" style="padding: 10px; border-bottom: 1px solid;">No Absentees</td>
                    </tr>
                {:else}
                    {#each response.data as absentee}
                        <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">{absentee.id}</td>
                        <td style="padding: 10px;">{absentee.name}</td>
                        <td style="padding: 10px;">{absentee.surname}</td>
                        <td style="padding: 10px;">{absentee.major}</td>
                        <td style="padding: 10px;">{absentee.element}</td>
                        <td style="padding: 10px;">{new Date(absentee.date).getDate()} / {new Date(absentee.date).getMonth()} / {new Date(absentee.date).getFullYear()}</td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    {:catch error}
        <p>Erreur : {error.message}</p>
    {/await}
</div>