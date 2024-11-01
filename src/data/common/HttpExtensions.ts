export async function getRequest(url: string) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then(res => {
        const json = res.json()
        console.log(json)

        return json
    })
}