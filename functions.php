<?php
/* enqueue scripts and style from parent theme */
function twentytwenty_styles() {
	wp_enqueue_style( 'parent', get_stylesheet_directory_uri() . '/dist/styles/style.css' );
}
add_action( 'wp_enqueue_scripts', 'twentytwenty_styles');

