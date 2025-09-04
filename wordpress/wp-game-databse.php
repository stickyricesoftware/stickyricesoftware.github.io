/*
Plugin Name: WP Game Database (Single Page) - Fixed SQL
Description: Hardcoded games + admin form + DataTables list with inline editing, custom table storage. SQL comment syntax fixed.
Version: 1.0.1
Author: You
*/

if (!defined('ABSPATH')) exit;

/* -------------------- Game class and hardcoded list -------------------- */
class Game {
    public $game_name;
    public $game_description;
    public $game_admin_instructions;
    public $game_user_instructions;

    public function __construct($name, $description, $admin_instructions = '', $user_instructions = '') {
        $this->game_name = $name;
        $this->game_description = $description;
        $this->game_admin_instructions = $admin_instructions;
        $this->game_user_instructions = $user_instructions;
    }
}

global $games_list;
$games_list = [
    new Game('Hangman', 'Guess the word', 'Enter a single word for users to guess.', 'Enter a letter to start guessing the word.'),
    // Add more games here, hardcoded only.
];

/* -------------------- Main plugin class -------------------- */
class WP_Game_Database_Plugin {
    private $table;
    private $nonce_action = 'wpgd_nonce_action';
    private $nonce_name   = 'wpgd_nonce';

    public function __construct() {
        global $wpdb;
        $this->table = $wpdb->prefix . 'game_database';

        add_action('admin_menu', [$this, 'add_menu']);
        add_action('admin_init', [$this, 'maybe_create_table']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);

        add_action('wp_ajax_wpgd_add', [$this, 'ajax_add']);
        add_action('wp_ajax_wpgd_update_cell', [$this, 'ajax_update_cell']);
        add_action('wp_ajax_wpgd_delete', [$this, 'ajax_delete']);


    }

    // Create table (no inline -- comments in SQL)
    public function maybe_create_table() {
        if (!current_user_can('manage_options')) return;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$this->table} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            game_name VARCHAR(191) NOT NULL,
            game_date VARCHAR(10) NOT NULL,
            answer TEXT NULL,
            hint TEXT NULL,
            array_a TEXT NULL,
            array_b TEXT NULL,
            image_id BIGINT(20) UNSIGNED NULL,
            number_val INT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY game_name (game_name),
            KEY game_date (game_date)
        ) $charset_collate;";

        dbDelta($sql);
    }

    public function add_menu() {
        add_menu_page('Game Database', 'Game Database', 'manage_options', 'wpgd', [$this, 'render_page'], 'dashicons-database', 26);
    }

    public function enqueue_assets($hook) {
        if ($hook !== 'toplevel_page_wpgd') return;

        // WP media
        wp_enqueue_media();

        // DataTables CDN
        wp_enqueue_style('wpgd-dt-css', 'https://cdn.datatables.net/1.13.8/css/jquery.dataTables.min.css', [], '1.13.8');
        wp_enqueue_script('wpgd-dt-js', 'https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js', ['jquery'], '1.13.8', true);

        // Register an inline-only script handle (no external file)
        wp_register_script('wpgd-admin', false, ['jquery', 'wpgd-dt-js'], '1.0.1', true);
        wp_enqueue_script('wpgd-admin');

		// jQuery UI Datepicker
wp_enqueue_script('jquery-ui-datepicker');
wp_enqueue_style(
    'jquery-ui-css',
    'https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css',
    [],
    '1.13.2'
);
		
        $local = [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce($this->nonce_action),
            'games'   => $this->get_games_for_js(),
            'mediaTitle' => 'Select or Upload Image',
            'mediaButton' => 'Use this image',
        ];
        wp_add_inline_script('wpgd-admin', 'window.WPGD = ' . wp_json_encode($local) . ';', 'before');
        wp_add_inline_script('wpgd-admin', $this->admin_js());

        // Minimal inline CSS
        $css = '
            .wpgd-form .regular-text { width: 100%; max-width: 420px; }
            .wpgd-flex { display: flex; gap: 12px; flex-wrap: wrap; }
            .wpgd-flex .field { min-width: 260px; flex: 1; }
            .wpgd-media-preview img { max-width: 80px; height: auto; display:block; margin-top:6px; border:1px solid #ccd0d4; }
            td[contenteditable="true"] { background: #fff; outline: 1px dashed #ccd0d4; }
            .wpgd-small { font-size:12px; color:#666; }
        ';
        wp_add_inline_style('wpgd-dt-css', $css);
    }

    private function admin_js() {
        return <<<'JS'
jQuery(function($){
// Initialise DataTable    
var table = $('#wpgd-table').DataTable({ pageLength:25, order:[[0,'desc']] });

	    // Initialise Datepicker on the game_date input
    $('input[name="game_date"]').datepicker({
        dateFormat: 'dd-mm-yy',
        showOn: 'button',
        buttonText: '📅'
    });

    var frame;
    $('#wpgd-pick-image').on('click', function(e){
        e.preventDefault();
        if (frame) { frame.open(); return; }
        frame = wp.media({ title: WPGD.mediaTitle, button: { text: WPGD.mediaButton }, multiple: false });
        frame.on('select', function(){
            var attachment = frame.state().get('selection').first().toJSON();
            $('#image_id').val(attachment.id);
            $('#wpgd-image-preview').html('<img src="'+(attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url)+'" alt="">');
        });
        frame.open();
    });

    $('#wpgd-add-form').on('submit', function(e){
        e.preventDefault();
        var data = $(this).serializeArray();
        data.push({name:'action', value:'wpgd_add'});
        data.push({name:'_ajax_nonce', value: WPGD.nonce});
        $.post(WPGD.ajaxUrl, data, function(resp){
            if(resp && resp.success){ location.reload(); }
            else{ alert(resp && resp.data ? resp.data : 'Error saving.'); }
        });
    });

    function saveCell(id, field, value){
        return $.post(WPGD.ajaxUrl, { action:'wpgd_update_cell', _ajax_nonce: WPGD.nonce, id: id, field: field, value: value });
    }

    $('#wpgd-table').on('blur keydown', '[contenteditable="true"]', function(e){
        if(e.type === 'keydown' && e.key !== 'Enter') return;
        if(e.type === 'keydown' && e.key === 'Enter'){ e.preventDefault(); $(this).blur(); return; }
        var $cell = $(this);
        var id = $cell.closest('tr').data('id');
        var field = $cell.data('field');
        var value = $cell.text().trim();
        if(field === 'game_date'){
            var re = /^\d{2}-\d{2}-\d{4}$/;
            if(!re.test(value)){ alert('Date must be DD-MM-YYYY'); return; }
        }
        saveCell(id, field, value).done(function(resp){
            if(!resp || !resp.success){ alert(resp && resp.data ? resp.data : 'Update failed'); }
        });
    });

    $('#wpgd-table').on('click', '.wpgd-change-image', function(e){
        e.preventDefault();
        var btn = $(this);
        var id = btn.closest('tr').data('id');
        var rowFrame = wp.media({ title: WPGD.mediaTitle, button: { text: WPGD.mediaButton }, multiple: false });
        rowFrame.on('select', function(){
            var attachment = rowFrame.state().get('selection').first().toJSON();
            $.post(WPGD.ajaxUrl, { action:'wpgd_update_cell', _ajax_nonce: WPGD.nonce, id: id, field: 'image_id', value: attachment.id }, function(resp){
                if(resp && resp.success){
                    btn.closest('td').find('img').attr('src', (attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url));
                } else { alert(resp && resp.data ? resp.data : 'Image update failed'); }
            });
        });
        rowFrame.open();
    });

    $('#wpgd-table').on('click', '.wpgd-delete', function(e){
        e.preventDefault();
        if(!confirm('Delete this row?')) return;
        var tr = $(this).closest('tr');
        var id = tr.data('id');
        $.post(WPGD.ajaxUrl, { action:'wpgd_delete', _ajax_nonce: WPGD.nonce, id: id }, function(resp){
            if(resp && resp.success){ table.row(tr).remove().draw(); }
            else{ alert(resp && resp.data ? resp.data : 'Delete failed'); }
        });
    });
});
JS;
    }

    private function get_games_for_js() {
        global $games_list;
        return array_map(function($g){ return $g->game_name; }, $games_list);
    }

    public function render_page() {
        if (!current_user_can('manage_options')) return;
        global $games_list;
        $nonce = wp_create_nonce($this->nonce_action);

        echo '<div class="wrap"><h1>Game Database</h1>';
        echo '<h2>Add Game Data</h2>';
        echo '<form id="wpgd-add-form" class="wpgd-form">';
        echo '<input type="hidden" name="'.$this->nonce_name.'" value="'.esc_attr($nonce).'">';
        echo '<div class="wpgd-flex">';

        echo '<div class="field"><label><strong>Game Name</strong></label><br/>';
        echo '<select name="game_name" class="regular-text" required><option value="">Select a game</option>';
        foreach ($games_list as $g) echo '<option value="'.esc_attr($g->game_name).'">'.esc_html($g->game_name).'</option>';
        echo '</select></div>';

        echo '<div class="field"><label><strong>Date</strong></label><br/>';
        echo '<input type="text" name="game_date" class="regular-text" placeholder="DD-MM-YYYY" required />';
        echo '<div class="wpgd-date-note">Example: 25-12-2025</div></div>';

        echo '<div class="field"><label><strong>Answer</strong> (optional)</label><br/>';
        echo '<input type="text" name="answer" class="regular-text" /></div>';

        echo '<div class="field"><label><strong>Hint</strong> (optional)</label><br/>';
        echo '<input type="text" name="hint" class="regular-text" /></div>';

        echo '<div class="field" style="flex-basis:100%"><label><strong>Array A</strong> (comma separated, optional)</label><br/>';
        echo '<textarea name="array_a" rows="2" class="regular-text" placeholder="word1, word2"></textarea></div>';

        echo '<div class="field" style="flex-basis:100%"><label><strong>Array B</strong> (comma separated, optional)</label><br/>';
        echo '<textarea name="array_b" rows="2" class="regular-text" placeholder="alpha, beta"></textarea></div>';

        echo '<div class="field"><label><strong>Number</strong> (integer, optional)</label><br/>';
        echo '<input type="number" name="number_val" class="regular-text" step="1" /></div>';

        echo '<div class="field"><label><strong>Image</strong> (optional)</label><br/>';
        echo '<input type="hidden" name="image_id" id="image_id" value="">';
        echo '<button class="button" id="wpgd-pick-image" type="button">Select Image</button>';
        echo '<div class="wpgd-media-preview" id="wpgd-image-preview"></div></div>';

        echo '</div>';
        echo '<p><button type="submit" class="button button-primary">Add Entry</button></p>';
        echo '</form>';

        echo '<hr><h2>All Game Data</h2>';
        $rows = $this->get_all_rows();
        echo '<table id="wpgd-table" class="wp-list-table widefat fixed striped"><thead><tr>';
        echo '<th>ID</th><th>Game</th><th>Date (DD-MM-YYYY)</th><th>Answer</th><th>Hint</th><th>Array A</th><th>Array B</th><th>Image</th><th>Number</th><th>Actions</th>';
        echo '</tr></thead><tbody>';

        foreach ($rows as $r) {
            $thumb = $r->image_id ? wp_get_attachment_image_src($r->image_id, 'thumbnail') : false;
            $src = $thumb ? $thumb[0] : '';
            echo '<tr data-id="'.esc_attr($r->id).'">';
            echo '<td>'.esc_html($r->id).'</td>';
            echo '<td contenteditable="true" data-field="game_name">'.esc_html($r->game_name).'</td>';
            echo '<td contenteditable="true" data-field="game_date">'.esc_html($r->game_date).'</td>';
            echo '<td contenteditable="true" data-field="answer">'.esc_html($r->answer).'</td>';
            echo '<td contenteditable="true" data-field="hint">'.esc_html($r->hint).'</td>';
            echo '<td contenteditable="true" data-field="array_a">'.esc_html($this->json_to_commalist($r->array_a)).'</td>';
            echo '<td contenteditable="true" data-field="array_b">'.esc_html($this->json_to_commalist($r->array_b)).'</td>';
            echo '<td>';
            if ($src) echo '<img src="'.esc_url($src).'" alt="" style="max-width:60px;height:auto;display:block;margin-bottom:6px;">';
            echo '<button class="button button-small wpgd-change-image">Change Image</button>';
            echo '</td>';
            echo '<td contenteditable="true" data-field="number_val">'.esc_html($r->number_val).'</td>';
            echo '<td><a href="#" class="button-link-delete wpgd-delete">Delete</a></td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
        echo '<p class="wpgd-small">Tip: Click into a cell to edit, then press Enter or click away to save.</p>';
        echo '</div>';
    }

    private function get_all_rows() {
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM {$this->table} ORDER BY id DESC");
    }

    private function parse_commalist_to_json($text) {
        if ($text === null || $text === '') return null;
        $parts = array_filter(array_map('trim', explode(',', $text)), function($v){ return $v !== ''; });
        return $parts ? wp_json_encode(array_values($parts)) : null;
    }

    private function json_to_commalist($json) {
        if (!$json) return '';
        $arr = json_decode($json, true);
        if (!is_array($arr)) return '';
        return implode(', ', array_map('strval', $arr));
    }

    private function validate_date_ddmmyyyy($date) {
        if (!preg_match('/^\d{2}-\d{2}-\d{4}$/', $date)) return false;
        list($d,$m,$y) = explode('-', $date);
        return checkdate((int)$m, (int)$d, (int)$y);
    }

    public function ajax_add() {
        if (!current_user_can('manage_options')) wp_send_json_error('Permission denied');
        check_ajax_referer($this->nonce_action);

        global $wpdb;
        $game_name = isset($_POST['game_name']) ? sanitize_text_field($_POST['game_name']) : '';
        $game_date = isset($_POST['game_date']) ? sanitize_text_field($_POST['game_date']) : '';
        $answer    = isset($_POST['answer']) ? sanitize_text_field($_POST['answer']) : '';
        $hint      = isset($_POST['hint']) ? sanitize_text_field($_POST['hint']) : '';
        $array_a   = isset($_POST['array_a']) ? wp_unslash($_POST['array_a']) : '';
        $array_b   = isset($_POST['array_b']) ? wp_unslash($_POST['array_b']) : '';
        $image_id  = isset($_POST['image_id']) ? intval($_POST['image_id']) : null;
        $number    = isset($_POST['number_val']) && $_POST['number_val'] !== '' ? intval($_POST['number_val']) : null;

        if (!$game_name) wp_send_json_error('Game name required.');
        if (!$game_date || !$this->validate_date_ddmmyyyy($game_date)) wp_send_json_error('Invalid date format. Use DD-MM-YYYY.');

        $array_a_json = $this->parse_commalist_to_json($array_a);
        $array_b_json = $this->parse_commalist_to_json($array_b);

        $inserted = $wpdb->insert(
            $this->table,
            [
                'game_name'  => $game_name,
                'game_date'  => $game_date,
                'answer'     => $answer,
                'hint'       => $hint,
                'array_a'    => $array_a_json,
                'array_b'    => $array_b_json,
                'image_id'   => $image_id,
                'number_val' => $number,
            ],
            ['%s','%s','%s','%s','%s','%s','%d','%d']
        );

        if ($inserted === false) wp_send_json_error('Database insert failed.');
        wp_send_json_success(true);
    }

    public function ajax_update_cell() {
        if (!current_user_can('manage_options')) wp_send_json_error('Permission denied');
        check_ajax_referer($this->nonce_action);

        global $wpdb;
        $id    = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $field = isset($_POST['field']) ? sanitize_key($_POST['field']) : '';
        $value = isset($_POST['value']) ? wp_unslash($_POST['value']) : '';

        if (!$id || !$field) wp_send_json_error('Missing parameters.');

        $allowed = ['game_name','game_date','answer','hint','array_a','array_b','image_id','number_val'];
        if (!in_array($field, $allowed, true)) wp_send_json_error('Invalid field.');

        $data = []; $format = [];

        switch ($field) {
            case 'game_name':
                $data[$field] = sanitize_text_field($value); $format[] = '%s'; break;
            case 'game_date':
                $val = sanitize_text_field($value);
                if (!$this->validate_date_ddmmyyyy($val)) wp_send_json_error('Invalid date format. Use DD-MM-YYYY.');
                $data[$field] = $val; $format[] = '%s'; break;
            case 'answer':
            case 'hint':
                $data[$field] = sanitize_text_field($value); $format[] = '%s'; break;
            case 'array_a':
            case 'array_b':
                $data[$field] = $this->parse_commalist_to_json($value); $format[] = '%s'; break;
            case 'image_id':
                $data[$field] = intval($value); $format[] = '%d'; break;
            case 'number_val':
                $data[$field] = ($value === '' ? null : intval($value)); $format[] = '%d'; break;
        }

        $updated = $wpdb->update($this->table, $data, ['id' => $id], $format, ['%d']);
        if ($updated === false) wp_send_json_error('Update failed.');
        wp_send_json_success(true);
    }

    public function ajax_delete() {
        if (!current_user_can('manage_options')) wp_send_json_error('Permission denied');
        check_ajax_referer($this->nonce_action);
        global $wpdb;
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if (!$id) wp_send_json_error('Missing ID');
        $deleted = $wpdb->delete($this->table, ['id' => $id], ['%d']);
        if ($deleted === false) wp_send_json_error('Delete failed.');
        wp_send_json_success(true);
    }
}

new WP_Game_Database_Plugin();
