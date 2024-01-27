<script lang="ts">
    import axios from "axios";
    let apiServer:string =import.meta.env.VITE_API_SERVER;
</script>

<div style="width: 20%; justify-content: center;" >
    <h2>Student Count</h2>
    {#await axios.post(apiServer+"/studentcount",{
        token: localStorage.getItem('token'),
        teacherId: localStorage.getItem('teacherId')
    })}
        loading...
    {:then response}
        <h1>{response.data.count}</h1>
    {:catch error}
        <p>Erreur : {error.message}</p>
    {/await}
</div>
