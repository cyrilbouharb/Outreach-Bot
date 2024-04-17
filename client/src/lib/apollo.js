// export async function loadPosts() {
//     // Call an external API endpoint to get posts
//     const res = await fetch('https://.../posts/')
//     const data = await res.json()
   
//     return data
//   }

export async function searchApollo () {
    
    try {
    const response = await fetch("http://localhost:5000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({organization, location, title}),
    });
    
    
    if (!response.ok) {
    throw new Error(
    "Search failed: " + response.status
    );
    }
    
    const data = await response.json();
    return data
    // localStorage.setItem('displayData', JSON.stringify(data));
    // console.log(data);
    // // Reset form fields
    // setLocation("");
    // setOrganization("");
    // setTitle("");
    // Optionally, redirect the user or update the UI further here
    } catch (error) {
    console.error("Signup error:", error.message);
    //setErrorMessage(error.message); // Display error message on UI
    }
    };