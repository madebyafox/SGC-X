

```{r}

# theme_custom <- function (base_size = 12, base_family = "Roboto Condensed") {
#   half_line <- base_size/2
#   theme(

#     line = element_line(color = "black", size = .5,
#                         linetype = 1, lineend = "butt"),
#     rect = element_rect(fill = "white", color = "black",
#                         size = .5, linetype = 1),
#     text = element_text(family = base_family, face = "plain",
#                         color = "black", size = base_size,
#                         lineheight = .9, hjust = .5, vjust = .5,
#                         angle = 0, margin = margin(), debug = FALSE),

#     axis.line = element_blank(),
#     axis.line.x = NULL,
#     axis.line.y = NULL,

#     axis.text = element_text(size = base_size * 1.1, color = "gray30"),
#     axis.text.x = element_text(margin = margin(t = .8 * half_line/2),
#                                vjust = 1),
#     axis.text.x.top = element_text(margin = margin(b = .8 * half_line/2),
#                                    vjust = 0),
#     axis.text.y = element_text(margin = margin(r = .8 * half_line/2),
#                                hjust = 1),
#     axis.text.y.right = element_text(margin = margin(l = .8 * half_line/2),
#                                      hjust = 0),

#     axis.ticks = element_line(color = "gray30", size = .7),
#     axis.ticks.length = unit(half_line / 1.5, "pt"),
#     axis.ticks.length.x = NULL,
#     axis.ticks.length.x.top = NULL,
#     axis.ticks.length.x.bottom = NULL,
#     axis.ticks.length.y = NULL,
#     axis.ticks.length.y.left = NULL,
#     axis.ticks.length.y.right = NULL,


#     axis.title.x = element_text(margin = margin(t = half_line),
#                                 vjust = 1, size = base_size * 1.3,
#                                 face = "bold"),
#     axis.title.x.top = element_text(margin = margin(b = half_line),
#                                     vjust = 0),
#     axis.title.y = element_text(angle = 90, vjust = 1,
#                                 margin = margin(r = half_line),
#                                 size = base_size * 1.3, face = "bold"),
#     axis.title.y.right = element_text(angle = -90, vjust = 0,
#                                       margin = margin(l = half_line)),
#  


#     legend.background = element_rect(color = NA),
#     legend.spacing = unit(.4, "cm"),
#     legend.spacing.x = NULL,
#     legend.spacing.y = NULL,
#     legend.margin = margin(.2, .2, .2, .2, "cm"),
#     legend.key = element_rect(fill = "gray95", color = "white"),
#     legend.key.size = unit(1.2, "lines"),
#     legend.key.height = NULL,
#     legend.key.width = NULL,
#     legend.text = element_text(size = rel(.8)),
#     legend.text.align = NULL,
#     legend.title = element_text(hjust = 0),
#     legend.title.align = NULL,
#     legend.position = "right",
#     legend.direction = NULL,
#     legend.justification = "center",
#     legend.box = NULL,
#     legend.box.margin = margin(0, 0, 0, 0, "cm"),
#     legend.box.background = element_blank(),
#     legend.box.spacing = unit(.4, "cm"),


#     panel.background = element_rect(fill = "white", color = NA),
#     panel.border = element_rect(color = "gray30",
#                                 fill = NA, size = .7),
#     panel.grid.major = element_line(color = "gray90", size = 1),
#     panel.grid.minor = element_line(color = "gray90", size = .5,
#                                     linetype = "dashed"),
#     panel.spacing = unit(base_size, "pt"),
#     panel.spacing.x = NULL,
#     panel.spacing.y = NULL,
#     panel.ontop = FALSE,


#     strip.background = element_rect(fill = "white", color = "gray30"),
#     strip.text = element_text(color = "black", size = base_size),
#     strip.text.x = element_text(margin = margin(t = half_line,
#                                                 b = half_line)),
#     strip.text.y = element_text(angle = -90,
#                                 margin = margin(l = half_line,
#                                                 r = half_line)),
#     strip.text.y.left = element_text(angle = 90),
#     strip.placement = "inside",
#     strip.placement.x = NULL,
#     strip.placement.y = NULL,
#     strip.switch.pad.grid = unit(0.1, "cm"),
#     strip.switch.pad.wrap = unit(0.1, "cm"),


#     plot.background = element_rect(color = NA),
#     plot.title = element_text(size = base_size * 1.8, hjust = .5,
#                               vjust = 1, face = "bold",
#                               margin = margin(b = half_line * 1.2)),
#     plot.title.position = "panel",
#     plot.subtitle = element_text(size = base_size * 1.3,
#                                  hjust = .5, vjust = 1,
#                                  margin = margin(b = half_line * .9)),
#     plot.caption = element_text(size = rel(0.9), hjust = 1, vjust = 1,
#                                 margin = margin(t = half_line * .9)),
#     plot.caption.position = "plot",
#     plot.tag = element_text(size = rel(1.2), hjust = .5, vjust = .5),
#     plot.tag.position = "topleft",
#     plot.margin = margin(base_size, base_size, base_size, base_size),
#     complete = TRUE
#   )
# }

library(hrbrthemes) #typographically thoughtful themes 

theme_sgc <- function (base_size = 12, base_family = "Roboto Condensed")
{
  
  theme_minimal()
  # half_line <- base_size/2
  # coord_cartesian(clip = "off", expand = FALSE)
  # # theme_ipsum() +
  # theme(
  #   
  #   # plot.margin = margin(25, 25, 10, 0),
  #   axis.line = element_line(size = 0.5, colour = "gray10"),
  # 
  #   #TITLES
  #   plot.title.position = "panel",
  #   plot.caption.position = "panel",
  #   plot.title = element_text(size = base_size * 1.5, 
  #                           hjust = 0, vjust = 1, face = "bold",
  #                           margin = margin(b = half_line )),
  #   plot.subtitle = element_text(size = base_size ,
  #                              hjust = 0, vjust = 1,
  #                              margin = margin(b = half_line * .9)),
  #   plot.caption = element_text(size = rel(0.9), hjust = 1, vjust = 0,
  #                             margin = margin(t = half_line * .9)),
  #   
  #   #PANEL
  #   panel.background = element_rect(fill = NA, color = NA),
  #   panel.grid.major = element_line(color = "gray90", size = 0),
  #   panel.grid.minor = element_line(color = "gray90", size = 0),
  #   
  #   #AXES      
  #   axis.text.x = element_text(hjust = 0.5),
  #   axis.title.x = element_text(vjust = 0, hjust = 0.5, 
  #                               size = base_size, face = "plain"),
  #   axis.title.y = element_text(vjust = 2, hjust = 0.5, 
  #                               size = base_size, face = "plain"),
  #   
  #   #FACETS
  #   strip.background = element_blank(),
  #   # strip.placement = "outside", 
  #   # strip.text = element_text(color = "black", size = base_size),
  #   strip.text.x = element_text(hjust=0.5),
  #   strip.text.y = element_text(hjust = 0.5, angle = -90),
  # 
  #   complete = FALSE
  # )
}

theme_set(theme_sgc())

```