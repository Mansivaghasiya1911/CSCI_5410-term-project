async function fetchData(apiUrl: string) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function postData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        console.log(response);

        if (!response.ok) {
            console.log(response);
            console.log('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function patchData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        console.log(response);
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        const data = (await response.json())['user'];
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'DELETE',
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function putData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        console.log("Response from ", `${apiUrl}`, response);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export {fetchData, postData, patchData, deleteData, putData};
