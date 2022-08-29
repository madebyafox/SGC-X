


##CUSTOM COLOR PALETTES
##########################################


## DEFINE COLORS
foxy_colors <- c(
  `orth` = "#7F7380",
  `other` = "#769393",
  `angular` = "#E1D066",
  `tri` = "#7C9E6B",
  `incorrect` = "#505153",
  `correct` = "#7C9E6B")

## EXTRACT HEX 
foxy_cols <- function(...) {
  cols <- c(...)
  if (is.null(cols))
    return (foxy_colors)
  foxy_colors[cols]
}

## CREATE PALETTES
foxy_palettes <- list(
  `state`  = foxy_cols("orth", "other", 
                       "angular", "tri"),
  `accuracy`  = foxy_cols("incorrect", "correct"),
  `all`   = foxy_cols("orth","other","angular",
                            "tri","incorrect","correct"))

## INTERPOLATE
foxy_pal <- function(palette = "main", reverse = FALSE, ...) {
  pal <- foxy_palettes[[palette]]
  if (reverse) pal <- rev(pal)
  colorRampPalette(pal, ...)
}

##DISPLAY
par(mfrow=c(1,2))

foxy_pal("state")(4) %>% show_col()
foxy_pal("accuracy")(2) %>% show_col()


scale_color_foxy <- function(palette = "main",
                             discrete = TRUE,
                             reverse = FALSE,
                             ...) {
  pal <- foxy_pal(palette = palette, reverse = reverse)
  
  if (discrete) {
    discrete_scale("colour", paste0("foxy_", palette), palette = pal, ...)
  } else {
    scale_color_gradientn(colours = pal(256), ...)
  }
}

scale_fill_foxy <- function(palette = "main", discrete = TRUE, reverse = FALSE, ...) {
  pal <- foxy_pal(palette = palette, reverse = reverse)
  
  if (discrete) {
    discrete_scale("fill", paste0("foxy_", palette), palette = pal, ...)
  } else {
    scale_fill_gradientn(colours = pal(256), ...)
  }
}

