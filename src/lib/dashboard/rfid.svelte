<script>
    let dump=""
    async function read() {
        console.log("User clicked scan button");

        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            console.log("> Scan started");

            ndef.addEventListener("readingerror", () => {
            console.log("Argh! Cannot read data from the NFC tag. Try another one?");
            });

            ndef.addEventListener("reading", ({ message, serialNumber }) => {
            console.log(`> Serial Number: ${serialNumber}`);
            console.log(`> Records: (${message.records[0]})`);
            dump = message.records[0].toString()
            });
        } catch (error) {
            console.log("Argh! " + error);
        }
    };

    async function write() {
        console.log("User clicked write button");

        try {
            const ndef = new NDEFReader();
            if (dump!=""){
                await ndef.write(dump);
            }
            console.log("> Message written");
        } catch (error) {
            console.log("Argh! " + error);
        }
    };

</script>

<div>
    <button on:click|preventDefault={read}>read</button>
    <button on:click|preventDefault={write}>write</button>
    <input type="text" bind:value={dump} on:submit={write} >
</div>
