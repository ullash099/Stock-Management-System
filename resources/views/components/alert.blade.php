
@if($type == 'error')
  <script>
    let options = {
      timeOut : 0,
      extendedTimeOut : 0,
      closeButton : true
    }
  </script>
  @if(is_array($msg) || is_object($msg))
    @foreach($msg->all() as $key => $value)
      <script>
        $(document).ready(function () {
          toastr.error('{{ $value }}', 'Error',options);
        });
      </script>
    @endforeach
  @else
    <script>
      $(document).ready(function () {
        toastr.error('{{ $value }}', 'Error',options);
      });
    </script>
  @endif
@elseif($type == 'success')
  <script>
    let options = {
      timeOut : 5000,
      closeButton : true,
      progressBar : true,
    }
  </script>
  @if(is_array($msg) || is_object($msg))
    @foreach($msg->all() as $key => $value)
      <script>
        $(document).ready(function () {
          toastr.success('{{ $msg }}', 'Wel done! Congratulations',options);
        });
      </script>
    @endforeach
  @else
    <script>
      $(document).ready(function () {
        toastr.success('{{ $msg }}', 'Wel done! Congratulations',options);
      });
    </script>
  @endif
@endif