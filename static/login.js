var linebuffer = []
var user = {
  name: '',
  password: ''
}

function renderText(line) {
  return line.value
}

function renderPrompt(line) {
  return line.value + ' ' + line.input
}

function renderPassword(line) {
  return line.value +
         ' ' +
          line.input.split('').map(function () { return  '*' }).join('')
}

function renderLine(line) {
  switch(line.type) {
    case 'text':
      return renderText(line)
    case 'prompt':
      return renderPrompt(line)
    case 'password':
      return renderPassword(line)
  }
}

function render() {
  var screen = ''
  for(var i = 0; i < linebuffer.length; i++) {
    screen += '<pre>' + renderLine(linebuffer[i]) + '</pre>'
  }
  $('#terminal').html(screen)
}

function print(text) {
  linebuffer.push({
    type: 'text',
    value: text
  })
}

function prompt(text, done) {
  linebuffer.push({
    type: 'prompt',
    value: text,
    input: '',
    done: done
  })
}

function password(text, done) {
  linebuffer.push({
    type: 'password',
    value: text,
    input: '',
    done: done
  })
}

function submitLogin(value) {
  user.name = value
  let line = linebuffer.pop()
  linebuffer.push({
    type: 'text',
    value: renderPrompt(line)
  })
  password('Password:', submitPassword)
  render()
}

function submitPassword(value) {
  user.password = value
  let line = linebuffer.pop()
  linebuffer.push({
    type: 'text',
    value: renderPassword(line)
  })
  linebuffer = []
  print('LineCon 28')
  prompt('Login:', submitLogin)
  render()
  submitForm()
}

function submitForm() {
  const uhash = CryptoJS.SHA512(user.name).toString()
  const phash = CryptoJS.SHA512(user.password).toString()
  user = {}
  post("/api/login", {
    uid: CryptoJS.SHA512(uhash + phash).toString()
  })
}

$(document).ready(function() {
  print('LineCon 28')
  prompt('Login:', submitLogin)
  render()
})

$(document).keyup(function(event) {
  var lastline = linebuffer[linebuffer.length - 1]
  if(lastline.type !== 'prompt') {
    return undefined
  }
  if(event.which === 8 || event.which === 46) {
    // User pressed backspace
    lastline.input = lastline.input.slice(0,-1)
    return render()
  }
})

$(document).keypress(function(event) {
  var lastline = linebuffer[linebuffer.length - 1]
  if(lastline.type !== 'prompt' && lastline.type !== 'password') {
    return undefined
  }
  if(event.which === 13) {
    lastline.done(lastline.input)
  }
  lastline.input += String.fromCharCode(event.which)
  render()
})

function post(path, params) {
  const form = document.createElement('form')
  form.method = 'post'
  form.action = path
  const keys = Object.keys(params)
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];
      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  form.submit();
}
