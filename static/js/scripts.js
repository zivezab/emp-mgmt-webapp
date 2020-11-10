(function ($) {
    "use strict"; // Start of use strict

    $(document).on('click', '.delete-entry', function(){
        var entry = $(this).attr("user-entry");
        var id = $(this).attr("user-id");
        // TODO: replace confirm dialog with better UX
        var result = confirm("Do you want to delete " +id+ "?");
        if (result) {
            $.ajax({
              url: "users/" + entry + "/",
              type: "DELETE",
              success: function(data) {
                // TODO: replace alert with better notification
                alert("User deleted! Reloading data...");
                loadUsersData();
              },
              error: function (xhr) {
                alert("Error: " + xhr.responseText);
              }
            });
        }
    });

    document.querySelector('.custom-file-input').addEventListener('change', (e)=>{
        const input = document.getElementById('input-file');

        if (input.files.length == 0) {
            return
        }

        const uploadForm = document.getElementById('upload-form');
        const progressBox = document.getElementById('progress-box');
        const cancelBox = document.getElementById('cancel-box');
        const cancelBtn = document.getElementById('cancel-btn');
        const csrf = document.getElementsByName('csrfmiddlewaretoken');

        const nextSibling = e.target.nextElementSibling;
        nextSibling.innerText = input.files[0].name;

        progressBox.classList.remove('not-visible');
        cancelBox.classList.remove('not-visible');

        const file = input.files[0];
        const url = URL.createObjectURL(file);

        const fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf[0].value);
        fd.append('file', file);

        $.ajax({
            type:'POST',
            url: uploadForm.action,
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function(){
              input.disabled = true;
              progressBox.innerHTML= "";
            },
            complete: function(){
              input.disabled = false;
              uploadForm.reset();
              progressBox.innerHTML="";
            },
            xhr: function(){
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', e=>{
                    if (e.lengthComputable) {
                        const percent = e.loaded / e.total * 100;
                        progressBox.innerHTML = `<div class="progress">
                                                    <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <p>${percent.toFixed(1)}%</p>`;
                        if (percent == 100) {
                            // TODO: replace alert with better notification
                            alert("File received, data is processing, please wait.");
                            cancelBox.classList.add('not-visible');
                            progressBox.append('Data is processing, please wait.');
                        }
                    }
                })
                cancelBtn.addEventListener('click', ()=>{
                    xhr.abort();
                    setTimeout(()=>{
                        uploadForm.reset();
                        progressBox.innerHTML="";
                        cancelBox.classList.add('not-visible');
                    }, 2000)
                })
                return xhr
            },
            success: function(response){
                // TODO: replace alert with better notification
                loadUsersData();
                alert("Data done processing! Reloading data...");
            },
            error: function(xhr){
                // TODO: replace alert with better notification
                alert("Error: " + xhr.responseText);
            },
            cache: false,
            contentType: false,
            processData: false,
        })
    });

    $("#update-user").click(function () {
        // TODO: disable save button when submitting data then enable afterward
        var id = $('#user-id').val();
        var name = $('#user-name').val();
        var login = $('#user-login').val();
        var salary = $('#user-salary').val();
        var entry = $('#user-entry').val();
        $.ajax({
          url: "users/" + entry + "/",
          type: "PUT",
          data: {
            id: id,
            name: name,
            login: login,
            salary: salary,
          },
          success: function(data) {
            // TODO: replace alert with better notification
            alert("User updated! Reloading data...");
            $('#editUserModal').modal('hide');
            loadUsersData();
          },
          error: function (xhr) {
            alert("Error: " + xhr.responseText);
          }
        });
    });

    $(".search-icon, #form-search").click(function () {
        var maxSalary = $('#max-salary').val();
        var minSalary = $('#min-salary').val();
        $('#x-min-salary').val(minSalary);
        $('#x-max-salary').val(maxSalary);
        loadUsersData();
    });

    $(".sort-btn").click(function () {
        var sortBy = $(this).attr("sort-by");
        var sortIcon = $(this).find(".sort-icon");
        var sortOrder = sortIcon.html();
        if (sortOrder == '-') {
            sortOrder = '+'
        } else {
            sortOrder = '-'
        }
        $(".sort-icon").html('');
        sortIcon.html(sortOrder);
        $("#x-sort").val(sortOrder + sortBy);
        loadUsersData();
    });

    $(document).on('click', '.data-pagination', function(){
        var offset = $(this).attr("offset");
        loadUsersData(offset);
    });

    $('#editUserModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget) // Button that triggered the modal
      var login = button.data('login') // Extract info from data-* attributes
      var name = button.data('name')
      var salary = button.data('salary')
      var id = button.data('id')
      var entry = button.data('entry')
      var modal = $(this)
      modal.find('#user-name').val(name)
      modal.find('#user-login').val(login)
      modal.find('#user-salary').val(salary)
      modal.find('#user-id').val(id)
      modal.find('#user-id-display').html(id)
      modal.find('#user-entry').val(entry)
    })

    function resetMinMaxSearch() {
        var maxSalary = $('#x-max-salary').val();
        var minSalary = $('#x-min-salary').val();
        $('#min-salary').val(minSalary);
        $('#max-salary').val(maxSalary);
    }

    function loadUsersData(offset){
        var sort = $("#x-sort").val();
        var minSalary = $("#x-min-salary").val();
        var maxSalary = $("#x-max-salary").val();
        offset = offset || '';
        $.ajax({
          url: "users/",
          data: {
            sort : sort,
            minSalary: minSalary,
            maxSalary: maxSalary,
            offset: offset,
            },
        }).done(function(obj) {
            resetMinMaxSearch();
            if (obj.results.length > 0){
                const User = (user) => `
                    <div class="row mt-3 mb-3">
                    <div class="col-sm-1"><i class="fas fa-image"></i></div>
                    <div class="col-sm-2">${user.id}</div>
                    <div class="col-sm-2">${user.name}</div>
                    <div class="col-sm-2">${user.login}</div>
                    <div class="col-sm-2">${user.salary}</div>
                    <div class="col-sm-3">
                        <a data-toggle="modal" data-target="#editUserModal" data-entry="${user._id}"
                           data-id="${user.id}" data-login="${user.login}" data-name="${user.name}"
                           data-salary="${user.salary}">
                            <i role="button"
                               class="mr-2 fas fa-pencil-alt"></i>
                        </a>
                        <a class="delete-entry" user-entry="${user._id}" user-id="${user.id}">
                            <i role="button" class="far fa-trash-alt"></i>
                        </a>
                    </div>
                </div>
                `;

                const Pagination = (obj) => {
                var prev = '';
                var next = '';
                if (obj.previous != null) {
                    var params = new URLSearchParams(obj.previous);
                    var offset = params.get('offset');
                    prev = `<a role="button" class="data-pagination" offset="${offset}">Prev</a>`;
                }

                if (obj.next != null) {
                    var params = new URLSearchParams(obj.next);
                    var offset = params.get('offset');
                    next = `<a role="button" class="data-pagination" offset="${offset}">Next</a>`;
                }

                return `
                  <div class="row mt-3 mb-3">
                     <div class="col-sm-12 text-center">
                         <span>${prev} ${next}</span>
                     </div>
                </div>
                `};
                // TODO: add loading
                $('#empty-container').hide();
                $('#users-data-container').html(obj.results.map(User).join('') + Pagination(obj));
                $('#users-data-container').show();
            } else {
                $('#empty-container').show();
                $('#users-data-container').hide();
            }
        });
    };

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
                this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate(
                    {
                        scrollTop: target.offset().top,
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#sideNav",
    });

    $(document).ready(function() {
        $('.sort-icons').hide();
        loadUsersData();

        // set csrf token before we perform POST or PUT request(s) to server
        var token =  $('input[name="csrfmiddlewaretoken"]').attr('value')
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', token);
            }
        });
    });

})(jQuery); // End of use strict
