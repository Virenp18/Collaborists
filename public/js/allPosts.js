$(document).ready(function () {
    // Call a function to fetch and display all projects
    fetchAllProjects();
});

// Function to make an API request to fetch all projects
const fetchAllProjects = async () => {
    try {
        const projectsResponse = await makeRequest('api/posts/allPosts', 'POST');
        // Handle the projectsResponse as needed
        displayProjects(projectsResponse.data);
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Handle errors or display error messages
    }
};

// Function to display projects in the UI
const displayProjects = (projects) => {
    // Assuming you have a container element with the ID "projectList" to display projects
    const projectListContainer = $('#projectList');

    // Clear existing content in the container
    projectListContainer.empty();

    // Check if projects array is not empty
    if (projects && projects.length > 0) {
        projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Iterate through projects and append them to the container
        projects.forEach(project => {
            let post_Url = `/img/pexels-photo-674010.jpeg`;
            if(project.url){
                post_Url = `/img/posts/${project.url}`;
            }
            projectListContainer.append(`<div class="card border-white">
            <a href="pages/singlePost" >
                <img class="card-img-top rounded-conrners preview"  src="${post_Url}" alt="Project Image">
            </a>
            <div class="card-footer d-flex justify-content-between mb-0" style="background-color: transparent; border-top : none;">
                <p class="text-secondary">${project.title}</p>
                <button type="button" data-toggle="tooltip" data-placement="top" title="tooltip" data-html="true" class="btn btn-link">
                    <i class="fa fa-ellipsis-h"></i>
                </button>
            </div>
        </div>`);
    });
} else {
    // Display a message if there are no projects
    projectListContainer.append('<p>No projects available.</p>');
}
};
