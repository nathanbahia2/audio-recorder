$(function () {
    const btnIniciar = $('.btn-iniciar-gravacao-audio')
    const btnParar = $('.btn-parar-gravacao-audio')
    const htmlAudio = $('audio')
    const tipoBase64 = $('#tipoBase64')
    const msgErro = $('#msgErro')


    btnIniciar.on('click', iniciarGravacao)
    btnParar.on('click', pararGravacao)


    function iniciarGravacao() {
        resetaAplicacao()


        // Oculta o botão de iniciar gravação        
        $(this).attr('hidden', true)


        // Remove qualquer eventHandler e exibe o botão de parar a gravação
        $(btnParar).unbind().attr('hidden', false)


        // Verifica se o navegador do usuário tem possibilidade de gravação
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                // Cria uma instancia do MediaRecorder para armazenar o áudio
                const mediaRecorder = new MediaRecorder(stream)
                let audios = []


                // Insere o áudio na lista container
                mediaRecorder.ondataavailable = (data) => {
                    audios.push(data.data)
                };


                // Callback chamado quando a gravação é encerrada
                mediaRecorder.onstop = () => {
                    
                    
                    // Cria arquivo temporário para para áudio
                    const blob = new Blob(audios, {
                        type: "audio/ogg; code=opus",
                    })


                    // Cria URL para arquivo temporário
                    const reader = new FileReader();
                    reader.readAsDataURL(blob)


                    // Ao término da gravação do arquivo temporário, um elemento audio
                    // é inserido no HTML com a gravação
                    reader.onloadend = () => {
                        const [typeb64, base64] = [...reader.result.split(',')]
                        tipoBase64.text(typeb64)
                        htmlAudio.attr('src', reader.result)
                        htmlAudio.attr('hidden', false)
                        console.log(base64)
                    };
                };


                // Inicia a gravação
                mediaRecorder.start()


                // Desabilita botão de iniciar a gravação
                $(btnIniciar).attr('hidden', true)


                // Habilita e adiciona event handler no botão de parar a gravação
                $(btnParar)
                    .attr('hidden', false)
                    .on('click', () => pararGravacao(mediaRecorder))
            },
            
            // Em caso de erro, a mensagem é exibida para o usuario
            (err) => {
                btnIniciar.attr('hidden', false)
                btnParar.attr('hidden', true)   
                msgErro.text(err)
            }
        );
    }


    function pararGravacao(mediaRecorder) {
        mediaRecorder.stop()  
        btnIniciar.attr('hidden', false)
        btnParar.attr('hidden', true)         
    }


    function resetaAplicacao() {
        htmlAudio.attr('src', '').attr('hidden', true)    
        btnIniciar.attr('hidden', false)
        btnParar.attr('hidden', true)   
        tipoBase64.text('') 
        msgErro.text('') 
    }
})
