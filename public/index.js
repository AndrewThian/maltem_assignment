/* globals $ */

$(document).ready(() => {
  $('#translate').off()
  $('#translate').on('click', () => {
    let inputText = $('#source').val()
    let inputLang = $('#lang').val()
    $.ajax({
      type: 'POST',
      url: `http://localhost:3000/translation/${inputLang}/${inputText}`,
      success: (translation) => {
        // output will change due to database checking if input has already been called..
        $('#json').html(JSON.stringify(translation))
        $('#output').html(translation.output.text)
      }
    })
  })
})
