$(function() {
    var todos = [];
    var localdata = localStorage.todos;
    var todos = localdata ? $.parseJSON(localdata):[];
    var state = localStorage.state || 'all'
    //保存数据
    var saveData = function(){
        localStorage.todos = JSON.stringify(todos);
    }
    var main = $('#main');
    var footer = $('#footer');

    main.hide();
    footer.hide();
    var toggleAll=function(){
        var fftodos = $.grep(todos, function(v) {
            return v.isDone === '1'
        })
        if (fftodos.length === todos.length) {
            $('#toggle-all').prop('checked','checked')
        }else{
            $('#toggle-all').removeProp('checked','checked')
        }
    }

    function render() {
        if (todos.length > 0) {
            main.show();
            footer.show();
        };
        if (todos.length === 0) {
            main.hide();
            footer.hide();
        };
        var ftodos = $.grep(todos, function(v) {
            if (state === 'all') {
                return v
            } else if (state === 'active') {
                return v.isDone === '0'
            } else if (state === 'completed') {
                return v.isDone === '1'
            }
        })
        $('#todo-list').empty().append(function() {
            return $.map(ftodos, function(v) {
                var tmp = v.isDone === '1' ? 'checked' : ''
                return '<li class="' + (v.isDone === '1' ? 'completed' : '') + '" data-id="' + v.id + '"><div class="view"><input class="toggle" type="checkbox" ' + tmp + '><label for="">' + v.content + '</label><button class="destroy"></button></div><input type="text" class="edit" value="' + v.content + '"></li>'
            })
        })
        $('#filters .selected').removeClass('selected')
        $('footer a[data-role=' + state + ']').addClass('selected')
        $('#todo-count strong').text(ftodos.length)
        toggleAll();
        piliang()
    }

    function piliang() {
        if ($('.completed').length === 0) {
            $('#clear-completed').css('opacity', 0);
        } else {
            $('#clear-completed').css('opacity', 1);
        }
    }
    render()

    var addTodo = function(e) {
        var zhi = $.trim($(this).val())
        if (e.keyCode === 13 && $.trim(zhi) !== '') {
            var todo = {
                id: todos.length ? (Math.max.apply(null, $.map(todos, function(v) {
                    return v.id
                })) + 1 + '') : '1001',
                content: zhi,
                isDone: '0'
            }
            todos.push(todo);
            saveData();
            $(this).val('');
            render();
        }
    }
    $('#new-todo').on('keyup', addTodo)

    var deleteDoto = function(e) {
        $(this).closest('li').remove();
        var id = $(this).closest('li').attr('data-id');
        todos = $.grep(todos, function(v) {
            return id !== v.id
        })
        saveData();
        render();
    }
    $('#todo-list').on('click', '.destroy', deleteDoto)

    var changeinput = function(e) {
        $(this).addClass('editing');
        var input = $(this).find('.edit');
        input.val(input.val()).focus();
    }
    $('#todo-list').on('dblclick', 'li', changeinput)

    $('#todo-list').on('focusout', '.edit', function() {
        $(this).closest('li').removeClass('editing');
    })

    var updateinput = function(e) {
        var id = $(this).closest('li').attr('data-id');
        var value = $(this).val();
        $.each(todos, function(i, v) {
            if (v.id === id) {
                v.content = value;
            }
        })
        saveData();
        render();
    }
    $('#todo-list').on('change', '.edit', updateinput)

    var changechecked = function(e) {
        var state = $(this).prop('checked');
        if (state === true) {
            state = '1'
        } else if (state === false) {
            state = '0'
        }
        var value = $(this).closest('li').find('.edit').val();
        var id = $(this).closest('li').attr('data-id')
        $.each(todos, function(i, v) {
            if (v.id === id) {
                v.isDone = state;
            }
        })
        saveData();
        render();
    }
    $('#todo-list').on('click', '.toggle', changechecked)

    $('#filters a').on('click', function() {
        $('#filters .selected').removeClass('selected')
        $(this).addClass('selected');
        state = localStorage.data = $(this).attr('data-role');
        render()
    })

    $('#clear-completed').on('click', function() {
        var todosId = $.grep(todos, function(v) {
            if (v.isDone === '1') {
                return v;
            }
        })
        todos = $.grep(todos, function(v) {
            if (v.isDone === '0') {
                return v;
            }
        })
        saveData()
        render()
    })

   

    $('#toggle-all').on('click', function() {
        var state = $(this).prop('checked')
        if ($(this).prop('checked')) {
            state = '1';
        } else {
            state = '0';
        }
        todos = $.grep(todos, function(v) {
            return v.isDone = state;
        })
        saveData();
        render();
    })
})